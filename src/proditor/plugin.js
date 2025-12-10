import { Extension } from './extension.js'

export class Plugin extends Extension {
    get type() {
        return 'plugin';
    }

    get showInMenu() {
        return false
    }
}