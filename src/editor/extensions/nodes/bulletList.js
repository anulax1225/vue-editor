import { Node } from '@/editor/node.js'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { wrapInList } from 'prosemirror-schema-list'

export class BulletList extends Node {
    get name() {
        return "bullet_list";
    }

    get schema() {
        return {
            content: "list_item+",
            group: "block",
            parseDOM: [{ tag: "ul" }],
            toDOM() { return ["ul", 0] }
        }
    }

    get menuItem() {
        return [
            {
                icon: '•',
                title: 'Bullet List',
                action: () => this.editor.chain().toggleBulletList().run(),
                isActive: () => this.isActive(),
                group: "blocks",
            }
        ]
    }

    get keymap() {
        return {
            'Ctrl-Shift-8': () => this.editor.chain().toggleBulletList().run(),
        }
    }

    get commands() {
        return {
            toggleBulletList: () => (state, dispatch, view) => {
                return wrapInList(state.schema.nodes[this.name])(state, dispatch, view)
            }
        }
    }

    inputRules(schema) {
        return [
            wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes[this.name]),
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
