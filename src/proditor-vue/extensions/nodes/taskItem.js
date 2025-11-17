import { Node } from '@/proditor/node.js'
import { TaskItemView } from '../../components'
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'

export class TaskItem extends Node {
    get name() {
        return "task_item";
    }

    get schema() {
        return {
            content: "paragraph block*",
            defining: true,
            attrs: {
                checked: { default: false }
            },
            parseDOM: [{
                tag: 'li[data-type="task-item"]',
                getAttrs(dom) {
                    return {
                        checked: dom.getAttribute('data-checked') === 'true'
                    }
                }
            }],
            toDOM(node) {
                return [
                    "li",
                    {
                        "data-type": "task-item",
                        "data-checked": node.attrs.checked
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return TaskItemView
    }

    get showInMenu() {
        return false
    }

    get keymap() {
        return {
            //'Enter': () => splitListItem(this.editor.schema.nodes[this.name])(this.editor.state, this.editor.view.dispatch),
            'Mod-[': () => liftListItem(this.editor.schema.nodes[this.name])(this.editor.state, this.editor.view.dispatch),
            'Mod-]': () => sinkListItem(this.editor.schema.nodes[this.name])(this.editor.state, this.editor.view.dispatch),
        }
    }

    get commands() {
        return {
            toggleTaskItem: () => (state, dispatch) => {
                const { $from } = state.selection
                let depth = $from.depth
                
                while (depth >= 0) {
                    const node = $from.node(depth)
                    if (node.type.name === this.name) {
                        const pos = $from.before(depth)
                        const tr = state.tr.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            checked: !node.attrs.checked
                        })
                        dispatch?.(tr)
                        return true
                    }
                    depth--
                }
                return false
            },
            splitListItem: () => splitListItem(this.editor.schema.nodes[this.name]),
            liftListItem: () => liftListItem(this.editor.schema.nodes[this.name]),
            sinkListItem: () => sinkListItem(this.editor.schema.nodes[this.name]),
        }
    }
}
