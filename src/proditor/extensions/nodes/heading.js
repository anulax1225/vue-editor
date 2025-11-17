import { Node } from '@/proditor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { createBlockCommand, markdownNodeInputRule } from '@/proditor/utils.js'

export class Heading extends Node {
    get schema() {
        return {
            attrs: { level: { default: 1 } },
            content: "(text)*",
            group: "block",
            defining: true,
            parseDOM: [
                { tag: "h1", attrs: { level: 1 } },
                { tag: "h2", attrs: { level: 2 } },
                { tag: "h3", attrs: { level: 3 } },
                { tag: "h4", attrs: { level: 4 } },
                { tag: "h5", attrs: { level: 5 } },
                { tag: "h6", attrs: { level: 6 } }
            ],
            toDOM(node) { return ["h" + node.attrs.level, 0] }
        }
    }

    get menuItem() {
        return [1, 2, 3].map(level => ({
            icon: `H${level}`,
            title: `Heading ${level}`,
            action: () => this.editor.chain().setHeading(level).run(),
            isActive: () => {
                const { $from } = this.editor.view.state.selection
                return (
                    this.isActive() && $from.parent.attrs.level === level
                );
            },
            group: "text",
        }))
    }


    get commands() {
        return {
            setHeading: (level) => createBlockCommand(this.name, { level }),
        };
    }

    get keymap() {
        return {
            'Ctrl-Shift-1': () => this.editor.chain().setHeading(1).run(),
            'Ctrl-Shift-2': () => this.editor.chain().setHeading(2).run(),
            'Ctrl-Shift-3': () => this.editor.chain().setHeading(3).run(),
        }
    }

    inputRules(schema) {
        const maxLevel = 3;
        return [
            markdownNodeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"), this.name, match => ({ level: match[1].length })),
        ]
    }
}