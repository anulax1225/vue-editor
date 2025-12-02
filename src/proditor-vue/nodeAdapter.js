import { createApp, reactive, markRaw, nextTick, h } from 'vue'

export class VueNodeAdapter {
    constructor(component, node, view, getPos, editor) {
        this.component = component
        this.node = node
        this.view = markRaw(view) // Prevent Vue from making view reactive
        this.getPos = getPos
        this.app = null
        this.vueInstance = null

        // Generate a unique ID for this node view instance
        this.instanceId = Math.random().toString(36).substr(2, 9)

        // Create a unique DOM element for this instance
        this.dom = document.createElement('div')
        this.dom.classList.add('vue-node-view')
        this.dom.dataset.instanceId = this.instanceId

        // Create a deep copy of node attributes to ensure isolation
        this.reactiveProps = reactive({
            node: this.node,
            view: this.view,
            getPos: this.getPos,
            updateAttrs: this.updateAttrs.bind(this),
            contentDOM: this.contentDOM,
            editor: editor,
        });

        // Create Vue app with a wrapper that injects contentDOM
        this.app = createApp({
            setup: () => {
                return () => h(component, this.reactiveProps)
            }
        })

        this.vueInstance = this.app.mount(this.dom)

        const componentContentDOM = this.dom.querySelector("[prose-content]");
        if (componentContentDOM) this.contentDOM = componentContentDOM;
    }

    updateAttrs(attrs) {
        if (typeof this.getPos === 'function') {
            const pos = this.getPos()
            if (pos === undefined) return

            const markup = {
                ...this.node.attrs,
                ...attrs,
            };
            console.log(markup)
            const transaction = this.view.state.tr.setNodeMarkup(pos, null, markup)
            this.view.dispatch(transaction)
        }
    }

    update(node) {
        // Only update if it's the same node type
        if (node.type !== this.node.type) {
            return false
        }

        // Update the stored node reference
        this.node = node

        // Create a deep copy of the new attributes
        const newNodeData = {
            attrs: { ...node.attrs },
            type: node.type,
        }

        // Update the reactive props with new data
        // This ensures Vue sees the change
        if (this.reactiveProps) {
            Object.assign(this.reactiveProps.node.attrs, newNodeData.attrs)
        }

        return true
    }

    destroy() {
        if (this.app) {
            try {
                this.app.unmount()
            } catch (e) {
                console.warn('Error unmounting Vue app:', e)
            }
            this.app = null
            this.vueInstance = null
            this.reactiveProps = null
        }
    }

    stopEvent(event) {
        const target = event.target
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'BUTTON' ||
            target.tagName === 'TEXTAREA'
        ) {
            return true
        }
        return false
    }

    ignoreMutation(mutation) {
        // Don't ignore mutations inside contentDOM - ProseMirror needs to track them
        if (this.contentDOM && (
            this.contentDOM === mutation.target ||
            this.contentDOM.contains(mutation.target)
        )) {
            return false
        }
        
        // Ignore all other mutations (Vue-controlled parts)
        return true
    }

    selectNode() {
        this.dom.classList.add('ProseMirror-selectednode')
    }

    deselectNode() {
        this.dom.classList.remove('ProseMirror-selectednode')
    }
}