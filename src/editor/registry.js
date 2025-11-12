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
        const items = [];
        this.getAll()
            .filter(ext => ext.showInMenu && ext.menuItem)
            .map(ext => items.push(...ext.menuItem))
        items.forEach(item => item.isActive = item.isActive ? item.isActive : () => false);
        return items;
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