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
                isActive: () => this.isActive(),
                isDisabled: () => false,
                group: 'table',
                showInBubble: true,
            }
        ];
    }
}