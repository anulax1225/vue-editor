import { createApp, reactive, markRaw } from 'vue'

export class VueNodeAdapter {
  constructor(component, node, view, getPos) {
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
    const nodeData = {
      attrs: { ...node.attrs },
      type: node.type,
    }

    // Create reactive props that are unique to this instance
    const reactiveProps = reactive({
      node: nodeData,
      view: this.view,
      getPos: this.getPos,
      updateAttrs: this.updateAttrs.bind(this),
    })

    // Create a completely isolated Vue app instance
    this.app = createApp(component, reactiveProps)
    
    // Store the reactive props so we can update them
    this.reactiveProps = reactiveProps

    // Mount to this specific DOM element
    this.vueInstance = this.app.mount(this.dom)

    // Check if the component exposes a contentDOM element
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
    if (this.contentDOM && this.contentDOM.contains(mutation.target)) {
      return false
    }
    return true
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode')
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode')
  }
}