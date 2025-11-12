import { Node } from '@/editor/node.js'
import { selectNodeBackward, selectNodeForward } from 'prosemirror-commands'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { TextSelection } from "prosemirror-state"

export class Doc extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('doc')
    }

    get showInMenu() {
        return false
    }

    get keymap() {
        return {
            "Tab": () => this.editor.chain().next().run(),
            "Shift-Tab": () => this.editor.chain().prev().run(),
        }
    }

    get commands() {
        return {
            next: () => (state, dispatch, view) => {
                const { $from } = state.selection;
                const afterCurrentNode = $from.after($from.depth);
                const $afterCurrent = state.doc.resolve(afterCurrentNode);
                const nextNode = $afterCurrent.nodeAfter;
                if (!nextNode) return false;
                const endOfNextNode = afterCurrentNode + nextNode.nodeSize - 1;
                const tr = state.tr.setSelection(
                    TextSelection.near(state.doc.resolve(endOfNextNode))
                );
                if (dispatch) dispatch(tr);
                return true;
            },
            prev: () => (state, dispatch, view) => {
                const { $from } = state.selection;
                const afterCurrentNode = $from.after($from.depth);
                const $afterCurrent = state.doc.resolve(afterCurrentNode);
                const endOfNextNode = $afterCurrent.pos - $afterCurrent.node.nodeSize;
                const tr = state.tr.setSelection(
                    TextSelection.near(state.doc.resolve(endOfNextNode))
                );
                if (dispatch) dispatch(tr);
                return true;
            },
        }
    }
}