export class Extension {
    constructor(options = {}) {
        this.options = options
        this.name = this.constructor.name.toLowerCase()
    }

    get type() {
        return 'extension'
    }

    get priority() {
        return this.options.priority || 100
    }

    get schema() {
        return null
    }

    get plugins() {
        return []
    }

    get toolbar() {
        return null
    }

    get bubbleMenu() {
        return null
    }

    get keymap() {
        return {}
    }

    get commands() {
        return {}
    }

    get inputRules() {
        return []
    }

    get pasteRules() {
        return []
    }

    onCreate(editor) {
        this.editor = editor
    }

    onDestroy() { }
}

export class Node extends Extension {
    get type() {
        return 'node'
    }

    get schema() {
        throw new Error('Schema must be defined')
    }

    get component() {
        return null
    }

    get showInMenu() {
        return true
    }

    get menuItem() {
        return {
            icon: null,
            title: this.name,
            action: () => { },
            isActive: () => false,
            isDisabled: () => false,
        }
    }
}

export class Registry {
    constructor() {
        this.extensions = new Map()
        this.nodes = new Map()
        this.marks = new Map()
    }

    register(extension) {
        const instance = typeof extension === 'function'
            ? new extension()
            : extension

        this.extensions.set(instance.name, instance)

        if (instance.type === 'node') {
            this.nodes.set(instance.name, instance)
        } else if (instance.type === 'mark') {
            this.marks.set(instance.name, instance)
        }

        return instance
    }

    registerMultiple(extensions) {
        return extensions.map(ext => this.register(ext))
    }

    get(name) {
        return this.extensions.get(name)
    }

    getAll() {
        return Array.from(this.extensions.values())
    }

    getNodes() {
        return Array.from(this.nodes.values())
    }

    getMarks() {
        return Array.from(this.marks.values())
    }

    getSorted() {
        return this.getAll().sort((a, b) => a.priority - b.priority)
    }

    getMenuItems() {
        return this.getAll()
            .filter(ext => ext.showInMenu && ext.menuItem)
            .map(ext => ({
                name: ext.name,
                ...ext.menuItem,
            }))
    }

    getBubbleMenuItems() {
        return this.getAll()
            .filter(ext => ext.bubbleMenu)
            .map(ext => ({
                name: ext.name,
                ...ext.bubbleMenu,
            }))
    }
}