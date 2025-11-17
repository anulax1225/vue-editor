import { Node } from '@/proditor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { createBlockCommand, markdownNodeInputRule } from '@/proditor/utils.js'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { wrapIn } from 'prosemirror-commands'

export class BlockQuote extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('blockquote')
    }

    get menuItem() {
        return [
            {
                icon: '|>',
                title: 'Blockquote',
                action: () => this.editor.chain().setBlockQuote().run(),
                isActive: () => this.isActive(),
                group: "blocks",
            }
        ];
    }

    get keymap() {
        return {
            'Ctrl->': () => this.editor.chain().setBlockQuote().run(),
        }
    }

    get commands() {
        return {
            setBlockQuote: () => (state, dispatch, view) => wrapIn(state.schema.nodes[this.name])(state, dispatch, view)

        }
    }

    inputRules(schema) {
        return [
            wrappingInputRule(/^\s*>\s$/, schema.nodes[this.name]),
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