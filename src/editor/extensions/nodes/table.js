import { Node } from '@/editor/node.js'
import { createAtomCommand } from '@/editor/utils.js'

export class Table extends Node {
    get schema() {
        return {
            content: "table_row+",
            tableRole: "table",
            isolating: true,
            group: "block",
            parseDOM: [{ tag: "table" }],
            toDOM() { return ["table", ["tbody", 0]] }
        }
    }

    get menuItem() {
        return [
            {
                icon: '▦',
                title: 'Table',
                action: () => this.editor.chain().insertTable().run(),
                isActive: () => false,
                group: "blocks",
            }
        ]
    }

    get commands() {
        return {
            insertTable: (rows = 3, cols = 3) => (state, dispatch) => {
                const { schema } = state
                const rowNodes = []
                
                for (let i = 0; i < rows; i++) {
                    const cells = []
                    for (let j = 0; j < cols; j++) {
                        const cellType = i === 0 ? schema.nodes.table_header : schema.nodes.table_cell
                        cells.push(cellType.createAndFill())
                    }
                    rowNodes.push(schema.nodes.table_row.create(null, cells))
                }
                
                const table = schema.nodes.table.create(null, rowNodes)
                const tr = state.tr.replaceSelectionWith(table)
                
                if (dispatch) {
                    dispatch(tr.scrollIntoView())
                }
                return true
            }
        }
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
