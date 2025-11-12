import { Node } from '@/editor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'
import { createBlockCommand, markdownInputRule } from '../utils';

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
            setCodeBlock: () => createBlockCommand(this.name),
        };
    }

    inputRules(schema)  {
        return [
            markdownInputRule(/^```\s$/, this.name),
        ]
    }
}