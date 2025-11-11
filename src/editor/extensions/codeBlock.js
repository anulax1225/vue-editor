import { Node } from '@/editor'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { textblockTypeInputRule } from 'prosemirror-inputrules'

export class CodeBlock extends Node {
    get schema() {
        return markdownSchema.spec.nodes.get('code_block')
    }

    get menuItem() {
        return [
            {
                icon: '</>',
                title: 'Code Block',
                action: () => this.editor.chain().setCodeBlock().run(),
                isActive: () => this.isActive(),
            }
        ]
    }

    get keymap() {
        return {
            'Ctrl-Shift-5': () => this.editor.chain().setCodeBlock().run(),
        }
    }

    get commands() {
        return {
            setCodeBlock: () => this.blockCommand(),
        };
    }

    inputRules(schema)  {
        return [
            textblockTypeInputRule(
                /^```$/,
                schema.nodes[this.name]
            ),
        ]
    }
}