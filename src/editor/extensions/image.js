import { Node } from '@/editor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { setBlockType } from 'prosemirror-commands'

export class Image extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('image')
    }

    get menuItem() {
        return [
            {
                icon: '🖼️',
                title: 'Image',
                action: () => this.editor.chain().setImage().run(),
                isActive: () => false,
            }
        ]
    }

    get commands() {
        return {
            setImage: () => this.blockCommand({ src: "", alt: "", title: "" }),
        };
    }
}