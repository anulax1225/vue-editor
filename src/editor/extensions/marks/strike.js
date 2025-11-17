import { Mark } from '@/editor/mark.js'
import { toggleMark } from 'prosemirror-commands'
import { markdownMarkInputRule } from '@/editor/utils.js'

export class Strike extends Mark {
    get schema() {
        return {
            parseDOM: [
                { tag: 's' },
                { tag: 'del' },
                { tag: 'strike' },
                { 
                    style: 'text-decoration',
                    getAttrs: value => value === 'line-through' && null
                }
            ],
            toDOM() { return ['s', 0] }
        }
    }

    get menuItem() {
        return [
            {
                icon: 'S̶',
                title: 'Strikethrough',
                action: () => this.editor.chain().toggleStrike().run(),
                isActive: () => this.isActive(),
                group: "text",
            }
        ]
    }

    get keymap() {
        return {
            'Mod-Shift-x': () => this.editor.chain().toggleStrike().run(),
            'Mod-Shift-X': () => this.editor.chain().toggleStrike().run(),
        }
    }

    inputRules(schema) {
        return [
            markdownMarkInputRule(/(?:~~)([^~]+)(?:~~)$/, this.name),
        ]
    }

    get commands() {
        return {
            toggleStrike: () => toggleMark(this.editor.schema.marks[this.name])
        }
    }
}
