import { Node } from '@/editor/node.js'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { wrapInList } from 'prosemirror-schema-list'

export class OrderedList extends Node {
    get name() {
        return "ordered_list";
    }

    get schema() {
        return {
            content: "list_item+",
            group: "block",
            attrs: { order: { default: 1 } },
            parseDOM: [{
                tag: "ol",
                getAttrs(dom) {
                    return { order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 }
                }
            }],
            toDOM(node) {
                return node.attrs.order == 1 ? ["ol", 0] : ["ol", { start: node.attrs.order }, 0]
            }
        }
    }

    get menuItem() {
        return [
            {
                icon: '1.',
                title: 'Ordered List',
                action: () => this.editor.chain().toggleOrderedList().run(),
                isActive: () => this.isActive(),
                group: "blocks",
            }
        ]
    }

    get keymap() {
        return {
            'Ctrl-Shift-9': () => this.editor.chain().toggleOrderedList().run(),
        }
    }

    get commands() {
        return {
            toggleOrderedList: () => (state, dispatch, view) => {
                return wrapInList(state.schema.nodes[this.name])(state, dispatch, view)
            }
        }
    }

    inputRules(schema) {
        return [
            wrappingInputRule(
                /^(\d+)\.\s$/,
                schema.nodes[this.name],
                match => ({ order: +match[1] }),
                (match, node) => node.childCount + node.attrs.order == +match[1]
            ),
        ]
    }

    isActive() {
        const { $from } = this.editor.state.selection
        let depth = $from.depth
        while (depth >= 0) {
            const node = $from.node(depth)
            if (node.type.name === this.name) return true
            depth--
        }
        return false
    }
}
