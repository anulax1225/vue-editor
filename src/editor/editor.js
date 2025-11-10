// editor/core/Editor.js
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { Registry } from './registry.js'
import { VueNode } from '@/vue-adapter/node.js'
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"

export class Editor {
    constructor({ element, extensions = [], content = '', nodeAdapter = null }) {
        this.registry = new Registry()
        this.element = element
        this.view = null
        this.listeners = new Map()
        this.nodeAdapter = nodeAdapter;
        this.registry.registerMultiple(extensions)
        this.init(content)
    }

    init(content) {
        // Build schema from extensions
        const schema = this.createSchema();

        // Collect plugins from extensions
        const plugins = this.createPlugins(schema)

        // Create editor state
        const state = EditorState.create({
            schema,
            plugins: [
                history(),
                keymap({ "Mod-z": undo, "Mod-y": redo }),
                keymap(baseKeymap),
                ...plugins,
            ],
            doc: content ? this.parseContent(content, schema) : undefined,
        })

        this.view = new EditorView(this.element, {
            state,
            dispatchTransaction: this.dispatchTransaction.bind(this),
            nodeViews: this.createNodeViews(),
        })

        this.baseSchema = schema;
        this.registry.getAll().forEach(ext => ext.onCreate(this))
    }

    createSchema() {
        const nodes = {}
        const marks = {}

        // Collect nodes from extensions
        this.registry.getNodes().forEach(node => {
            if (node.schema) {
                nodes[node.name] = node.schema
            }
        })

        // Collect marks from extensions
        this.registry.getMarks().forEach(mark => {
            if (mark.schema) {
                marks[mark.name] = mark.schema
            }
        })

        // Ensure required base nodes
        if (!nodes.doc) {
            nodes.doc = { content: 'block+' }
        }
        if (!nodes.text) {
            nodes.text = { group: 'inline' }
        }

        return new Schema({ nodes, marks })
    }

    createPlugins(schema) {
        const plugins = []

        // Collect plugins from extensions
        this.registry.getSorted().forEach(ext => {
            if (ext.plugins) {
                plugins.push(...ext.plugins)
            }

            // Add keymap if defined
            if (ext.keymap && Object.keys(ext.keymap).length > 0) {
                plugins.push(keymap(ext.keymap))
            }
        })

        return plugins
    }

    createNodeViews() {
        const nodeViews = {}

        this.registry.getNodes().forEach(node => {
            if (node.component) {
                nodeViews[node.name] = (pmNode, view, getPos) => {
                    return new VueNode(node.component, pmNode, view, getPos)
                }
            }
        })

        return nodeViews
    }

    parseContent(content, schema) {
        if (typeof content === 'string') {
            // Parse HTML string
            const parser = new window.DOMParser()
            const dom = parser.parseFromString(content, 'text/html')
            return DOMParser.fromSchema(schema).parse(dom.body)
        } else if (content && typeof content === 'object') {
            // Parse JSON
            return schema.nodeFromJSON(content)
        }
        return undefined
    }

    dispatchTransaction(transaction) {
        const newState = this.view.state.apply(transaction)
        this.view.updateState(newState)
        if (transaction.docChanged) {
            this.emit('update', { editor: this })
        }

        this.emit('transaction', { editor: this, transaction })
    }

    // Event system
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event).push(callback)
        return this
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return this

        if (callback) {
            const callbacks = this.listeners.get(event)
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        } else {
            this.listeners.delete(event)
        }
        return this
    }

    emit(event, data) {
        this.listeners.get(event)?.forEach(callback => callback(data))
        return this
    }

    // Commands
    chain() {
        return new CommandChain(this)
    }

    // Content getters
    getHTML() {
        const div = document.createElement('div')
        const fragment = DOMSerializer.fromSchema(this.view.state.schema)
            .serializeFragment(this.view.state.doc.content)
        div.appendChild(fragment)
        return div.innerHTML
    }

    getJSON() {
        return this.view.state.doc.toJSON()
    }

    getText() {
        return this.view.state.doc.textContent
    }

    // Content setters
    setContent(content) {
        const { doc, tr } = this.view.state
        const newDoc = this.parseContent(content, this.view.state.schema)

        if (newDoc) {
            const transaction = tr.replaceWith(0, doc.content.size, newDoc.content)
            this.view.dispatch(transaction)
        }

        return this;
    }

    // Get menu items for toolbar
    getMenuItems() {
        return this.registry.getMenuItems()
    }

    getBubbleMenuItems() {
        return this.registry.getBubbleMenuItems()
    }

    // State helpers
    get state() {
        return this.view.state
    }

    get schema() {
        return this.baseSchema
    }

    // Focus management
    focus(position) {
        if (position === 'end') {
            const { doc } = this.view.state
            const endPos = doc.content.size
            this.view.focus()
            this.view.dispatch(
                this.view.state.tr.setSelection(
                    TextSelection.create(doc, endPos)
                )
            )
        } else if (position === 'start') {
            this.view.focus()
            this.view.dispatch(
                this.view.state.tr.setSelection(
                    TextSelection.create(this.view.state.doc, 0)
                )
            )
        } else {
            this.view.focus()
        }
        return this
    }

    blur() {
        this.view.dom.blur()
        return this
    }

    // Destroy
    destroy() {
        this.registry.getAll().forEach(ext => ext.onDestroy?.())
        this.view?.destroy()
        this.listeners.clear()
    }
}

class CommandChain {
    constructor(editor) {
        this.editor = editor
        this.commands = []

        // Return a Proxy to intercept method calls
        return new Proxy(this, {
            get(target, prop) {
                // If the property exists on the target, return it
                if (prop in target) {
                    return target[prop]
                }

                // Otherwise, try to find a command in extensions
                return (...args) => {
                    const extensions = target.editor.registry.getAll()

                    for (const ext of extensions) {
                        if (ext.commands && ext.commands[prop]) {
                            console.log("found " + prop + " in " + ext.name)
                            target.commands.push(ext.commands[prop](...args))
                            return target // Return the proxy for chaining
                        }
                    }

                    console.warn(`Command "${prop}" not found`)
                    return target
                }
            }
        })
    }

    run() {
        const { state, dispatch } = this.editor.view
        let success = true

        for (const command of this.commands) {
            console.log("command")
            if (!command(state, dispatch, this.editor.view)) {
                success = false
                break
            }
        }

        this.commands = [] // Clear commands after running
        console.log("run", success)
        return success
    }

    // Add a custom command function directly
    command(fn) {
        this.commands.push(fn)
        return this
    }
}