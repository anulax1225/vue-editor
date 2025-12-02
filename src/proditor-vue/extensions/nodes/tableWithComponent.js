import { Table } from '@/proditor/extensions/nodes/table.js'
import { TablePanelItem } from "@/proditor-vue";

export class TableWithComponent extends Table {
    get name() {
        return "table";
    }

    get menuItem() {
        return [
            {
                icon: '▦',
                title: 'Table Operations',
                component: TablePanelItem,
                _editor: this.editor,
                commands: {
                    addRowBefore: () => this.editor.chain().addRowBefore().run(),
                    addRowAfter: () => this.editor.chain().addRowAfter().run(),
                    deleteRow: () => this.editor.chain().deleteRow().run(),
                    addColumnBefore: () => this.editor.chain().addColumnBefore().run(),
                    addColumnAfter: () => this.editor.chain().addColumnAfter().run(),
                    deleteColumn: () => this.editor.chain().deleteColumn().run(),
                    mergeCells: () => this.editor.chain().mergeCells().run(),
                    splitCell: () => this.editor.chain().splitCell().run(),
                    deleteTable: () => this.editor.chain().deleteTable().run(),
                },
                isActive: () => this.isActive(),
                isDisabled: () => false,
                group: 'table',
            }
        ];
    }
}