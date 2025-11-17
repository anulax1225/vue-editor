import { Node } from '@/proditor/node.js'
import { 
    tableNodes,
    addColumnAfter,
    addColumnBefore,
    deleteColumn,
    addRowAfter,
    addRowBefore,
    deleteRow,
    mergeCells,
    splitCell,
    toggleHeaderRow,
    toggleHeaderColumn,
    toggleHeaderCell,
    setCellAttr,
    deleteTable,
    columnResizing, 
    tableEditing, 
    goToNextCell
} from 'prosemirror-tables'

export class Table extends Node {
    get schema() {
        // Use the table schema from prosemirror-tables
        return tableNodes({
            tableGroup: "block",
            cellContent: "block+",
            cellAttributes: {
                background: {
                    default: null,
                    getFromDOM(dom) { return dom.style.backgroundColor || null },
                    setDOMAttr(value, attrs) { 
                        if (value) attrs.style = (attrs.style || "") + `background-color: ${value};` 
                    }
                }
            }
        }).table
    }

    get menuItem() {
        return [
            {
                icon: '▦',
                title: 'Insert Table',
                action: () => this.editor.chain().insertTable().run(),
                isActive: () => false,
                group: "blocks",
            },
            {
                icon: '⊞',
                title: 'Add Row After',
                action: () => this.editor.chain().addRowAfter().run(),
                isActive: () => this.isActive(),
                group: "table",
            },
            {
                icon: '⊟',
                title: 'Delete Row',
                action: () => this.editor.chain().deleteRow().run(),
                isActive: () => this.isActive(),
                group: "table",
            },
            {
                icon: '⊞|',
                title: 'Add Column After',
                action: () => this.editor.chain().addColumnAfter().run(),
                isActive: () => this.isActive(),
                group: "table",
            },
            {
                icon: '⊟|',
                title: 'Delete Column',
                action: () => this.editor.chain().deleteColumn().run(),
                isActive: () => this.isActive(),
                group: "table",
            },
            {
                icon: '⊡',
                title: 'Merge Cells',
                action: () => this.editor.chain().mergeCells().run(),
                isActive: () => this.isActive(),
                group: "table",
            },
            {
                icon: '⊠',
                title: 'Split Cell',
                action: () => this.editor.chain().splitCell().run(),
                isActive: () => this.isActive(),
                group: "table",
            },
            {
                icon: '🗑',
                title: 'Delete Table',
                action: () => this.editor.chain().deleteTable().run(),
                isActive: () => this.isActive(),
                group: "table",
            }
        ]
    }

    get plugins() {
        return [
            columnResizing(),
            tableEditing(),
        ];
    }

    get keymap() {
        return {
            'Tab': goToNextCell(1),
            'Shift-Tab': goToNextCell(-1),
            'Mod-Shift-t': () => this.editor.chain().insertTable().run(),
            'Mod-Shift-ArrowDown': () => this.editor.chain().addRowAfter().run(),
            'Mod-Shift-ArrowUp': () => this.editor.chain().addRowBefore().run(),
            'Mod-Shift-ArrowRight': () => this.editor.chain().addColumnAfter().run(),
            'Mod-Shift-ArrowLeft': () => this.editor.chain().addColumnBefore().run(),
            'Mod-Shift-Backspace': () => this.editor.chain().deleteRow().run(),
        }
    }

    get commands() {
        return {
            insertTable: (rows = 3, cols = 3) => (state, dispatch) => {
                const { schema } = state
                const rowNodes = []
                
                // Create header row
                const headerCells = []
                for (let j = 0; j < cols; j++) {
                    headerCells.push(schema.nodes.table_header.createAndFill())
                }
                rowNodes.push(schema.nodes.table_row.create(null, headerCells))
                
                // Create data rows
                for (let i = 1; i < rows; i++) {
                    const cells = []
                    for (let j = 0; j < cols; j++) {
                        cells.push(schema.nodes.table_cell.createAndFill())
                    }
                    rowNodes.push(schema.nodes.table_row.create(null, cells))
                }
                
                const table = schema.nodes.table.create(null, rowNodes)
                const tr = state.tr.replaceSelectionWith(table)
                
                if (dispatch) {
                    dispatch(tr.scrollIntoView())
                }
                return true
            },
            
            addColumnAfter: () => addColumnAfter,
            addColumnBefore: () => addColumnBefore,
            deleteColumn: () => deleteColumn,
            
            addRowAfter: () => addRowAfter,
            addRowBefore: () => addRowBefore,
            deleteRow: () => deleteRow,
            
            mergeCells: () => mergeCells,
            splitCell: () => splitCell,
            
            toggleHeaderRow: () => toggleHeaderRow,
            toggleHeaderColumn: () => toggleHeaderColumn,
            toggleHeaderCell: () => toggleHeaderCell,
            
            deleteTable: () => deleteTable,
            
            setCellAttr: (name, value) => setCellAttr(name, value),
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