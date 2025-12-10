import { Mark } from '@/proditor/mark.js'
import { toggleMark } from 'prosemirror-commands'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { markdownMarkInputRule } from '@/proditor/utils'

export class Italic extends Mark {
    get name() {
        return "em";
    }

    get schema() {
        return markdownSchema.spec.marks.get('em')
    }

    get menuItem() {
        return [
            {
                icon: 'I',
                title: 'Italic',
                action: () => this.editor.chain().toggleItalic().run(),
                isActive: () => this.isActive(),
                group: "text",
                showInBubble: true,
            }
        ]
    }

    get keymap() {
        return {
            'Mod-i': () => this.editor.chain().toggleItalic().run(),
            'Mod-I': () => this.editor.chain().toggleItalic().run(),
        }
    }

    inputRules(schema) {
        return [
            markdownMarkInputRule(/(?:^|[^*_])(\*|_)([^*_]+)\1$/, this.name),
        ]
    }

    get commands() {
        return {
           toggleItalic: () => toggleMark(this.editor.schema.marks[this.name])
        }
    }
}