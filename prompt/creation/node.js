import { Extension } from './extension.js'
import { setBlockType } from 'prosemirror-commands'

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

    blockCommand(attr = null) {
        return (state, dispatch, view) => setBlockType(state.schema.nodes[this.name], attr)(state, dispatch, view)
    } 

    isActive() {
        const { $from } = this.editor.state.selection
        return $from.parent.type.name === this.name
    }

    get schemaContent() {
        return ["div", ["data-content"], 0];
    }
}