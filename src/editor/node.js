import { Extension } from './extension.js'
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