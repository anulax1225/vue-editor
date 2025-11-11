import { Node } from '@/editor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { textblockTypeInputRule } from 'prosemirror-inputrules'

export class Heading extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('heading')
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
        }))
    }

    
    get commands() {
        return {
            setHeading: (level) => this.blockCommand({ level }),
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
        return [1, 2, 3, 4, 5, 6].map(level =>
            textblockTypeInputRule(
                new RegExp(`^(#{${level}})\\s$`),
                schema.nodes[this.name],
                { level }
            )
        )
    }
}