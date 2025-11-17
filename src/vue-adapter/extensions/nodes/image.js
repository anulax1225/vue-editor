// editor/extensions/nodes/Image.js
import { Node } from '@/editor/node.js'
import { ImageView } from '@/components/editor/views'
import { createAtomCommand } from '@/editor/utils'

export class Image extends Node {
    get schema() {
        return {
            inline: false,
            attrs: {
                src: { default: null },
                alt: { default: null },
                title: { default: null },
                width: { default: null },
                align: { default: 'center' }, // left, center, right
            },
            group: 'block',
            draggable: true,
            parseDOM: [
                {
                    tag: 'img[src]',
                    getAttrs: dom => ({
                        src: dom.getAttribute('src'),
                        alt: dom.getAttribute('alt'),
                        title: dom.getAttribute('title'),
                        width: dom.getAttribute('width'),
                        align: dom.getAttribute('data-align') || 'center',
                    }),
                },
            ],
            toDOM: node => [
                'img',
                {
                    src: node.attrs.src,
                    alt: node.attrs.alt,
                    title: node.attrs.title,
                    width: node.attrs.width,
                    'data-align': node.attrs.align,
                },
            ],
        }
    }

    get component() {
        return ImageView
    }

    get menuItem() {
        return [
            {
                icon: '🖼️',
                title: 'Image',
                action: () => this.editor.chain().setImage().run(),
                group: "media",
                isActive: () => false,
            }
        ]
    }

    get commands() {
        return {
            setImage: () => createAtomCommand(this.name, { src: "https://lipsum.app/random/600x200", alt: "", title: "" }),
        };
    }
}