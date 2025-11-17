import { Node } from '@/proditor/node.js'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { wrapInList } from 'prosemirror-schema-list'

export class TaskList extends Node {
    get name() {
        return "task_list";
    }

    get schema() {
        return {
            content: "task_item+",
            group: "block",
            parseDOM: [{
                tag: 'ul[data-type="task-list"]',
            }],
            toDOM() { 
                return ["ul", { "data-type": "task-list" }, 0] 
            }
        }
    }

    get menuItem() {
        return [
            {
                icon: '☑',
                title: 'Task List',
                action: () => this.editor.chain().toggleTaskList().run(),
                isActive: () => this.isActive(),
                group: "blocks",
            }
        ]
    }

    get keymap() {
        return {
            'Ctrl-Shift-7': () => this.editor.chain().toggleTaskList().run(),
        }
    }

    get commands() {
        return {
            toggleTaskList: () => (state, dispatch, view) => {
                return wrapInList(state.schema.nodes[this.name])(state, dispatch, view)
            }
        }
    }

    inputRules(schema) {
        return [
            wrappingInputRule(/^\s*(\[ \])\s$/, schema.nodes[this.name]),
        ]
    }

    isActive() {
        const { $from } = this.editor.state.selection
        let depth = $from.depth
        while (depth >= 0) {
            const node = $from.node(depth)
            if (node.type.name === this.name) return true
            depth--
        }
        return false
    }
}
