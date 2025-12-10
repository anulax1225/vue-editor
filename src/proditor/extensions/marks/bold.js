import { Mark } from '@/proditor/mark.js'
import { toggleMark } from 'prosemirror-commands'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { markdownMarkInputRule } from '@/proditor/utils.js'

export class Bold extends Mark {
    get name() {
        return "strong";
    }

    get schema() {
        return markdownSchema.spec.marks.get('strong')
    }

    get menuItem() {
        return [
            {
                icon: 'B',
                title: 'Bold',
                action: () => this.editor.chain().toggleBold().run(),
                isActive: () => this.isActive(),
                group: "text",
                showInBubble: true,
            }
        ]
    }

    get keymap() {
        return {
            'Mod-b': () => this.editor.chain().toggleBold().run(),
            'Mod-B': () => this.editor.chain().toggleBold().run(),
        }
    }

    inputRules(schema) {
        return [
            markdownMarkInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.name),
        ]
    }

    get commands() {
        return {
           toggleBold: () => toggleMark(this.editor.schema.marks[this.name])
        }
    }
}