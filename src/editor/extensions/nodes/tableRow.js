import { Node } from '@/editor/node.js'

export class TableRow extends Node {
    get name() {
        return "table_row";
    }

    get schema() {
        return {
            content: "(table_cell | table_header)*",
            tableRole: "row",
            parseDOM: [{ tag: "tr" }],
            toDOM() { return ["tr", 0] }
        }
    }

    get showInMenu() {
        return false
    }
}
