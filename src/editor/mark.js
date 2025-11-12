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

    isActive() {
        const { from, to, empty } = this.editor.state.selection
        const mark = this.editor.schema.marks[this.name]
        if (empty) {
            return !!mark.isInSet(
                this.editor.state.storedMarks ||
                this.editor.state.selection.$from.marks()
            )
        }
        return this.editor.state.doc.rangeHasMark(from, to, mark)
    }
}