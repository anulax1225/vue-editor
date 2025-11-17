import { Mark } from '@/editor/mark.js'
import { toggleMark } from 'prosemirror-commands'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { markdownMarkInputRule } from '@/editor/utils.js'

export class Code extends Mark {
    get schema() {
        return markdownSchema.spec.marks.get('code')
    }

    get menuItem() {
        return [
            {
                icon: '<>',
                title: 'Code',
                action: () => this.editor.chain().toggleCode().run(),
                isActive: () => this.isActive(),
                group: "text",
            }
        ]
    }

    get keymap() {
        return {
            'Mod-e': () => this.editor.chain().toggleCode().run(),
            'Mod-E': () => this.editor.chain().toggleCode().run(),
        }
    }

    inputRules(schema) {
        return [
            markdownMarkInputRule(/(?:`)([^`]+)(?:`)$/, this.name),
        ]
    }

    get commands() {
        return {
            toggleCode: () => toggleMark(this.editor.schema.marks[this.name])
        }
    }
}
