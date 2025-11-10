import { Node } from '@/editor/node.js'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { setBlockType } from 'prosemirror-commands'

export class Paragraph extends Node {
    get schema() {
        return basicSchema.spec.nodes.get('paragraph')
    }

    get menuItem() {
        return [
            {
                icon: '¶',
                title: 'Paragraph',
                action: () => this.editor.chain().setParagraph().run(),
                isActive: () => this.isActive(),
            }
        ]
    }

    get keymap() {
        return {
            'Ctrl-Shift-4': this.setParagraph(),
        }
    }

    get commands() {
        return {
            setParagraph: this.setParagraph,
        };
    }

    setParagraph() {
        return (state, dispatch, view) => {
            if (!this.editor.schema) return false;
            return setBlockType(
                this.editor.schema.nodes[this.name]
            )(state, dispatch);
        }
    }

    isActive() {
        const { $from } = this.editor.state.selection
        return $from.parent.type.name === this.name
    }
}