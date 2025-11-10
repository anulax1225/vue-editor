import { Extension } from './extension.js'

export class Mark extends Extension {
    get type() {
        return 'mark'
    }

    get schema() {
        throw new Error('Schema must be defined')
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