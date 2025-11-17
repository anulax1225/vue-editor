import { Mark } from '@/editor/mark.js'
import { toggleMark } from 'prosemirror-commands'

export class Superscript extends Mark {
    get schema() {
        return {
            excludes: 'subscript',
            parseDOM: [
                { tag: 'sup' },
                { 
                    style: 'vertical-align',
                    getAttrs: value => value === 'super' && null
                }
            ],
            toDOM() { return ['sup', 0] }
        }
    }

    get menuItem() {
        return [
            {
                icon: 'X²',
                title: 'Superscript',
                action: () => this.editor.chain().toggleSuperscript().run(),
                isActive: () => this.isActive(),
                group: "text",
            }
        ]
    }

    get keymap() {
        return {
            'Mod-.': () => this.editor.chain().toggleSuperscript().run(),
        }
    }

    get commands() {
        return {
            toggleSuperscript: () => toggleMark(this.editor.schema.marks[this.name])
        }
    }
}
