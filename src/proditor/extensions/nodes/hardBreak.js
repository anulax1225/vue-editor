import { Node } from '@/proditor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { chainCommands, exitCode } from 'prosemirror-commands'

export class HardBreak extends Node {
    get name() {
        return 'hard_break'
    }

    get schema() {
        return markdownSchema.spec.nodes.get('hard_break')
    }

    get showInMenu() {
        return false
    }

    get keymap() {
        const command = chainCommands(exitCode, (state, dispatch) => {
            if (dispatch) {
                dispatch(state.tr.replaceSelectionWith(this.editor.schema.nodes[this.name].create()).scrollIntoView())
            }
            return true
        })

        return {
            'Shift-Enter': command,
        }
    }

    get commands() {
        return {
            setHardBreak: () => (state, dispatch, view) => {
                if (dispatch) {
                    dispatch(
                        state.tr
                            .replaceSelectionWith(this.editor.schema.nodes[this.name].create())
                            .scrollIntoView()
                    )
                }
                return true
            },
        }
    }
}
