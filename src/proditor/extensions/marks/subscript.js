import { Mark } from '@/proditor/mark.js'
import { toggleMark } from 'prosemirror-commands'

export class Subscript extends Mark {
    get schema() {
        return {
            excludes: 'superscript',
            parseDOM: [
                { tag: 'sub' },
                {
                    style: 'vertical-align',
                    getAttrs: value => value === 'sub' && null,
                },
            ],
            toDOM() {
                return ['sub', 0]
            },
        }
    }

    get menuItem() {
        return [
            {
                icon: 'x₂',
                title: 'Subscript',
                action: () => this.editor.chain().toggleSubscript().run(),
                isActive: () => this.isActive(),
                group: 'text',
            },
        ]
    }

    get keymap() {
        return {
            'Mod-,': () => this.editor.chain().toggleSubscript().run(),
        }
    }

    get commands() {
        return {
            toggleSubscript: () => toggleMark(this.editor.schema.marks[this.name]),
        }
    }
}
