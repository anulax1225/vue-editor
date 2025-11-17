import { Node } from '@/editor/node.js'

export class TableHeader extends Node {
    get name() {
        return "table_header";
    }

    get schema() {
        return {
            content: "block+",
            attrs: {
                colspan: { default: 1 },
                rowspan: { default: 1 },
                colwidth: { default: null }
            },
            tableRole: "header_cell",
            isolating: true,
            parseDOM: [{
                tag: "th",
                getAttrs: dom => ({
                    colspan: dom.hasAttribute("colspan") ? +dom.getAttribute("colspan") : 1,
                    rowspan: dom.hasAttribute("rowspan") ? +dom.getAttribute("rowspan") : 1,
                    colwidth: dom.hasAttribute("data-colwidth") 
                        ? dom.getAttribute("data-colwidth").split(",").map(s => Number(s))
                        : null
                })
            }],
            toDOM(node) {
                const attrs = {}
                if (node.attrs.colspan != 1) attrs.colspan = node.attrs.colspan
                if (node.attrs.rowspan != 1) attrs.rowspan = node.attrs.rowspan
                if (node.attrs.colwidth) attrs["data-colwidth"] = node.attrs.colwidth.join(",")
                return ["th", attrs, 0]
            }
        }
    }

    get showInMenu() {
        return false
    }
}
