import { createApp } from 'vue'

export class VueNode {
    constructor(component, node, view, getPos) {
        this.component = component
        this.node = node
        this.view = view
        this.getPos = getPos
        this.app = null
        this.vueInstance = null

        // Create a DOM element
        this.dom = document.createElement('div')
        this.dom.classList.add('vue-node-view')

        // Create Vue app
        this.app = createApp(component, {
            node: this.node,
            view: this.view,
            getPos: this.getPos,
            updateAttrs: this.updateAttrs.bind(this),
        })

        // Mount the Vue component
        this.vueInstance = this.app.mount(this.dom)

        // Check if the component exposes a contentDOM element
        // This is where ProseMirror will render nested content
        if (this.vueInstance.contentDOM) {
            this.contentDOM = this.vueInstance.contentDOM
        }
    }

    updateAttrs(attrs) {
        if (typeof this.getPos === 'function') {
            const pos = this.getPos()
            if (pos === undefined) return

            const transaction = this.view.state.tr.setNodeMarkup(pos, null, {
                ...this.node.attrs,
                ...attrs,
            })
            this.view.dispatch(transaction)
        }
    }

    update(node) {
        if (node.type !== this.node.type) {
            return false
        }

        this.node = node

        // Update the Vue component props
        if (this.vueInstance && this.vueInstance.$props) {
            this.vueInstance.$props.node = node
        }

        return true
    }

    destroy() {
        if (this.app) {
            this.app.unmount()
        }
    }

    // Prevent ProseMirror from handling events inside Vue components
    stopEvent(event) {
        // Allow events on inputs, selects, and buttons
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

    // Ignore mutations to the Vue-controlled parts
    ignoreMutation(mutation) {
        // If there's a contentDOM, don't ignore mutations inside it
        if (this.contentDOM && this.contentDOM.contains(mutation.target)) {
            return false
        }
        // Ignore all other mutations (Vue handles its own DOM)
        return true
    }

    // Make the node selectable
    selectNode() {
        this.dom.classList.add('ProseMirror-selectednode')
    }

    deselectNode() {
        this.dom.classList.remove('ProseMirror-selectednode')
    }
}