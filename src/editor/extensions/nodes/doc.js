import { Node } from '@/editor/node.js'
import { selectNodeBackward, selectNodeForward } from 'prosemirror-commands'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { TextSelection } from "prosemirror-state"
import { baseKeymap } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { undo, redo, history } from "prosemirror-history"
import { inputRules, smartQuotes, emDash, ellipsis } from 'prosemirror-inputrules'

export class Doc extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('doc')
    }

    get showInMenu() {
        return
    }

    get plugins() {
        return [
            dropCursor(),
            gapCursor(),
            history(),
        ];
    }

    get keymap() {
        return {
            "Tab": () => this.editor.chain().next().run(),
            "Shift-Tab": () => this.editor.chain().prev().run(),
            "Mod-z": undo,
            "Mod-y": redo,
            ...baseKeymap
        }
    }

    get commands() {
        return {
            next: () => (state, dispatch, view) => {
                const { $from } = state.selection;
                const afterCurrentNode = $from.after($from.depth);
                const $afterCurrent = state.doc.resolve(afterCurrentNode);
                let targetNode = $afterCurrent.nodeAfter, targetPos;
                if (!targetNode) {
                    if ($from.depth <= 1) {
                        const firstNode = state.doc.child(0);
                        if (firstNode) {
                            targetNode = firstNode;
                            targetPos = firstNode.nodeSize - 1;
                        } else targetPos = 0;
                    } else {
                        const afterParent = $from.after($from.depth - 1);
                        const $afterParent = state.doc.resolve(afterParent);
                        targetNode = $afterParent.nodeAfter;
                        if (!targetNode) {
                            const firstNode = state.doc.child(0);
                            if (firstNode) {
                                targetNode = firstNode;
                                targetPos = firstNode.nodeSize - 1;
                            } else targetPos = 0;
                        } else targetPos = afterParent + targetNode.nodeSize - 1;
                    }
                } else targetPos = afterCurrentNode + targetNode.nodeSize - 1;

                if (targetNode && targetNode.type.spec.content === "block+") {
                    const firstChild = targetNode.firstChild;
                    if (firstChild) {
                        const startOfBlock = targetPos - targetNode.nodeSize + 1;
                        targetPos = startOfBlock + 1 + firstChild.nodeSize - 1;
                    }
                }
                if (targetPos !== undefined) {
                    const tr = state.tr.setSelection(
                        TextSelection.near(state.doc.resolve(targetPos), -1)
                    );
                    dispatch?.(tr);
                    return true;
                }
                return false;
            },
            prev: () => (state, dispatch, view) => {
                const { $from } = state.selection;
                const beforeCurrentNode = $from.before($from.depth);
                const $beforeCurrent = state.doc.resolve(beforeCurrentNode);
                let targetNode = $beforeCurrent.nodeBefore, targetPos;
                if (!targetNode) {
                    if ($from.depth <= 1) targetPos = state.doc.content.size;
                    else {
                        const beforeParent = $from.before($from.depth - 1);
                        const $beforeParent = state.doc.resolve(beforeParent);
                        targetNode = $beforeParent.nodeBefore;
                        if (!targetNode) targetPos = state.doc.content.size;
                        else targetPos = beforeParent - 1;
                    }
                } else targetPos = beforeCurrentNode - 1;

                if (targetNode && targetNode.type.spec.content === "block+") {
                    const $target = state.doc.resolve(targetPos);
                    targetPos = $target.end($target.depth);
                }
                if (targetPos !== undefined) {
                    const tr = state.tr.setSelection(
                        TextSelection.near(state.doc.resolve(targetPos), -1)
                    );
                    dispatch?.(tr);
                    return true;
                }
                return false;
            },
        }
    }

    inputRules(schema) {
        return smartQuotes.concat(ellipsis, emDash);
    }
}