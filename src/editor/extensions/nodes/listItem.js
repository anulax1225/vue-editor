import { Node } from '@/editor/node.js'
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'

export class ListItem extends Node {
    get name() {
        return "list_item";
    }

    get schema() {
        return {
            content: "paragraph block*",
            defining: true,
            parseDOM: [{ tag: "li" }],
            toDOM() { return ["li", 0] }
        }
    }

    get showInMenu() {
        return false
    }

    get keymap() {
        return {
            //'Enter': () => splitListItem(this.editor.schema.nodes[this.name])(this.editor.state, this.editor.view.dispatch),
            'Mod-[': () => liftListItem(this.editor.schema.nodes[this.name])(this.editor.state, this.editor.view.dispatch),
            'Mod-]': () => sinkListItem(this.editor.schema.nodes[this.name])(this.editor.state, this.editor.view.dispatch),
        }
    }

    get commands() {
        return {
            splitListItem: () => splitListItem(this.editor.schema.nodes[this.name]),
            liftListItem: () => liftListItem(this.editor.schema.nodes[this.name]),
            sinkListItem: () => sinkListItem(this.editor.schema.nodes[this.name]),
        }
    }
}
