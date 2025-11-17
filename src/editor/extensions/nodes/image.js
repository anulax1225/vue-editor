import { Node } from '@/editor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { setBlockType } from 'prosemirror-commands'
import { createAtomCommand } from '@/editor/utils.js'

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
                group: "media",
            }
        ]
    }

    get commands() {
        return {
            setImage: () => createAtomCommand(this.name, { src: "https://lipsum.app/random/600x200", alt: "", title: "" }),
        };
    }
}