import { Node } from '@/proditor/node.js'
import { tableNodes } from 'prosemirror-tables'

export class TableRow extends Node {
    get name() {
        return "table_row";
    }

    get schema() {
        // Use the table_row schema from prosemirror-tables
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
        }).table_row
    }

    get showInMenu() {
        return false
    }
}