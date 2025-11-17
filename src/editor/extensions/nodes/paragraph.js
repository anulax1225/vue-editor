import { Node } from '@/editor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'

export class Paragraph extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('paragraph')
    }

    get menuItem() {
        return [
            {
                icon: '¶',
                title: 'Paragraph',
                action: () => this.editor.chain().setParagraph().run(),
                isActive: () => this.isActive(),
                group: "text",
            }
        ]
    }

    get keymap() {
        return {
            'Ctrl-Shift-4': () => this.editor.chain().setParagraph().run(),
        }
    }

    get commands() {
        return {
            setParagraph: () => this.blockCommand(),
        };
    }
}