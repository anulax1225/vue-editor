// editor/core/Editor.js
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { Registry } from './registry.js'
import { keymap } from "prosemirror-keymap"
import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown"
import { inputRules } from 'prosemirror-inputrules'

export class Editor {
    static ContentType = Object.freeze({
        HTML: "html",
        MARKDOWN: "markdown",
        JSON: "json",
        TEXT: "text",
        parse(type, content, schema) {
            switch (type) {
                case "html": 
                    const parser = new window.DOMParser()
                    const dom = parser.parseFromString(content, 'text/html')
                    return DOMParser.fromSchema(schema).parse(dom.body)
                case "json": return schema.nodeFromJSON(content)
                case "markdown": return defaultMarkdownParser.parse(content)
                case "text": return content
            }
            return undefined
        },
        serialize(type, view) {
            switch (type) {
                case "html": 
                    const div = document.createElement('div')
                    const fragment = DOMSerializer.fromSchema(view.state.schema)
                        .serializeFragment(view.state.doc.content)
                    div.appendChild(fragment)
                    return div.innerHTML
                case "json": return view.state.doc.toJSON()
                case "markdown": return defaultMarkdownSerializer.serialize(view.state.doc)
                case "text": return view.state.doc.textContent
            }
            return undefined
        }
    })

    constructor({ element, extensions = [], content = '', nodeAdapter = null, editable = true }) {
        this.registry = new Registry();
        this.element = element;
        this.view = null;
        this.editable = editable;
        this.listeners = new Map();
        this.nodeAdapter = nodeAdapter;
        this.registry.registerMultiple(extensions)
        this.init(content)
    }

    init(content) {
        const schema = this.createSchema();
        const plugins = this.createPlugins(schema);
        const state = EditorState.create({
            schema,
            plugins,
            doc: content.value ? Editor.ContentType.parse(content.type, content.value, schema) : undefined,
        })
        this.view = new EditorView(this.element, {
            state,
            dispatchTransaction: this.dispatchTransaction.bind(this),
            nodeViews: this.createNodeViews(),
            editable: () => this.isEditable,
        })
        this.baseSchema = schema;
        this.registry.getAll().forEach(ext => ext.onCreate(this));
    }

    createSchema() {
        const nodes = {}
        const marks = {}

        this.registry.getNodes().forEach(node => {
            if (node.schema) {
                nodes[node.name] = node.schema
            }
        })

        this.registry.getMarks().forEach(mark => {
            if (mark.schema) {
                marks[mark.name] = mark.schema
            }
        })

        if (!nodes.doc) {
            nodes.doc = { content: 'block+' }
        }
        if (!nodes.text) {
            nodes.text = { group: 'inline' }
        }

        return new Schema({ nodes, marks })
    }

    setEditable(flag) {
        this.editable = flag;
    }

    get isEditable() {
        return this.editable
    }

    createPlugins(schema) {
        const rules = [];
        const keymaps = [];
        this.registry.getSorted().forEach(ext => {
            const extRules = ext.inputRules(schema);
            if (!Array.isArray(extRules)) rules.push(extRules);
            else rules.push(...extRules);

            if (ext.keymap && Object.keys(ext.keymap).length > 0) {
                keymaps.push(keymap(ext.keymap));
            }
        })

        const plugins = []
        if (rules.length > 0) {
            plugins.push(inputRules({ rules }))
        } 
        if (keymaps.length > 0) {
            plugins.push(...keymaps)
        }
        this.registry.getSorted().forEach(ext => {
            if (ext.plugins) {
                plugins.push(...ext.plugins)
            }
        })
        return plugins
    }

    createNodeViews() {
        const nodeViews = {}
        this.registry.getNodes().forEach(node => {
            if (node.component) {
                nodeViews[node.name] = (pmNode, view, getPos) => {
                    return new this.nodeAdapter(node.component, pmNode, view, getPos, this)
                }
            }
        })

        return nodeViews
    }

    parseContent(content, schema) {
        if (typeof content === 'string') {
            const parser = new window.DOMParser()
            const dom = parser.parseFromString(content, 'text/html')
            return DOMParser.fromSchema(schema).parse(dom.body)
        } else if (content && typeof content === 'object') {
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

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event).push(callback)
        return this
    }

    emit(event, data) {
        this.listeners.get(event)?.forEach(callback => callback(data))
        return this
    }

    chain() {
        return new CommandChain(this)
    }

    getContent(type) {
        return Editor.ContentType.serialize(type, this.view);
    }

    setContent(content) {
        const { doc, tr } = this.view.state
        const newDoc = Editor.ContentType.parse(content.type, content.value, schema)
        if (newDoc) {
            const transaction = tr.replaceWith(0, doc.content.size, newDoc.content)
            this.view.dispatch(transaction)
        }
        return this;
    }


    getMenuItems() {
        return this.registry.getMenuItems()
    }

    getBubbleMenuItems() {
        return this.registry.getBubbleMenuItems()
    }

    get state() {
        return this.view.state
    }

    get schema() {
        return this.view.state.schema;
    }

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
        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) {
                    return target[prop]
                }
                return (...args) => {
                    const extensions = target.editor.registry.getAll()

                    for (const ext of extensions) {
                        if (ext.commands && ext.commands[prop]) {
                            target.commands.push(ext.commands[prop](...args))
                            return target;
                        }
                    }
                    console.warn(`Command "${prop}" not found`)
                    return target
                }
            }
        })
    }

    run() {
        const view = this.editor.view;
        let success = true;
        for (const command of this.commands) {
            if (!command(view.state, view.dispatch.bind(view), view)) {
                success = false;
                break;
            }
        }
        this.commands = [];
        console.log("command", success);
        return success;
    }

    command(fn) {
        this.commands.push(fn)
        return this
    }
}