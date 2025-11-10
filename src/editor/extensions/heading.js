import { Node } from '@/editor/node.js'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { setBlockType } from 'prosemirror-commands'
import { textblockTypeInputRule } from 'prosemirror-inputrules'

export class Heading extends Node {
    get schema() {
        return basicSchema.spec.nodes.get('heading')
    }

    get menuItem() {
        return [1, 2, 3].map(level => ({
            icon: `H${level}`,
            title: `Heading ${level}`,
            action: () => this.editor.chain().setHeading(level).run(),
            isActive: () => {
                const { $from } = this.editor.view.state.selection
                return (
                    $from.parent.type.name === this.name &&
                    $from.parent.attrs.level === level
                );
            },
        }))
    }

    get keymap() {
        return {
            'Ctrl-Shift-1': this.setHeading(1),
            'Ctrl-Shift-2': this.setHeading(2),
            'Ctrl-Shift-3': this.setHeading(3),
        }
    }

    get inputRules() {
        return [1, 2, 3, 4, 5, 6].map(level =>
            textblockTypeInputRule(
                new RegExp(`^(#{${level}})\\s$`),
                this.editor.schema.nodes[this.name],
                { level }
            )
        )
    }

    get commands() {
        return {
            setHeading: this.setHeading.bind(this),
        };
    }

    setHeading(level) {
        return (state, dispatch, view) => {
            if (!this.editor.schema) return false;
            console.log(state.selection)
            return setBlockType(
                this.editor.schema.nodes[this.name],
                { level }
            )(state, dispatch, view);
        }
    }
}