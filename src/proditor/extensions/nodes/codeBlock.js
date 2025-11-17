import { Node } from '@/proditor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { createBlockCommand, markdownNodeInputRule } from '@/proditor/utils.js';

export class CodeBlock extends Node {
    get name() {
        return "code_block";
    }

    get schema() {
        return markdownSchema.spec.nodes.get('code_block')
    }

    get menuItem() {
        return [
            {
                icon: '<>',
                title: 'Code Block',
                action: () => this.editor.chain().setCodeBlock().run(),
                isActive: () => this.isActive(),
                group: "blocks",
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
            setCodeBlock: () => createBlockCommand(this.name),
        };
    }

    inputRules(schema)  {
        return [
            markdownNodeInputRule(/^```\s$/, this.name),
        ]
    }
}