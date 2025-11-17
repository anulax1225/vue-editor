// editor/extensions/nodes/HorizontalRule.js
import { Node } from '@/editor/node.js'
import { schema as basicSchema } from 'prosemirror-markdown'
import { createAtomCommand, createBlockCommand, markdownNodeInputRule } from '@/editor/utils.js'

export class HorizontalRule extends Node {
    get name() {
        return "horizontal_rule";
    }

    get schema() {
        return basicSchema.spec.nodes.get('horizontal_rule')
    }

    get menuItem() {
        return [
            {
                icon: '—',
                title: 'Horizontal Rule',
                action: () => this.editor.chain().setHR().run(),
                isActive: () => false,
                group: "blocks",
            }
        ]
    }

    inputRules(schema) {
        return [
            markdownNodeInputRule(/^---\s$/, this.name),
        ]
    }



    get commands() {
        return {
            setHR: () => createAtomCommand(this.name),
        };
    }
}