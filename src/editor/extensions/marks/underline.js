import { Mark } from '@/editor/mark.js'
import { toggleMark } from 'prosemirror-commands'

export class Underline extends Mark {
    get schema() {
        return {
            parseDOM: [
                { tag: 'u' },
                { 
                    style: 'text-decoration',
                    getAttrs: value => value === 'underline' && null
                }
            ],
            toDOM() { return ['u', 0] }
        }
    }

    get menuItem() {
        return [
            {
                icon: 'U',
                title: 'Underline',
                action: () => this.editor.chain().toggleUnderline().run(),
                isActive: () => this.isActive(),
                group: "text",
            }
        ]
    }

    get keymap() {
        return {
            'Mod-u': () => this.editor.chain().toggleUnderline().run(),
            'Mod-U': () => this.editor.chain().toggleUnderline().run(),
        }
    }

    get commands() {
        return {
            toggleUnderline: () => toggleMark(this.editor.schema.marks[this.name])
        }
    }
}