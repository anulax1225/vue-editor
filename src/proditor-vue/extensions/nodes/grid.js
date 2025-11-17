import { Node } from '@/proditor/node.js'
import { GridView } from '../../components'

export class Grid extends Node {
    get schema() {
        return {
            content: "griditem+",
            group: "block",
            defining: true,
            draggable: true,
            attrs: {
                columns: { default: 2 },
                rows: { default: 'auto' },
                gap: { default: 16 },
                columnGap: { default: null },
                rowGap: { default: null },
                alignItems: { default: 'stretch' },
                justifyItems: { default: 'stretch' }
            },
            parseDOM: [{
                tag: "div[data-grid]",
                getAttrs: dom => ({
                    columns: parseInt(dom.getAttribute("data-columns")) || 2,
                    rows: dom.getAttribute("data-rows") === 'auto' ? 'auto' : parseInt(dom.getAttribute("data-rows")),
                    gap: parseInt(dom.getAttribute("data-gap")) || 16,
                    columnGap: dom.getAttribute("data-column-gap") ? parseInt(dom.getAttribute("data-column-gap")) : null,
                    rowGap: dom.getAttribute("data-row-gap") ? parseInt(dom.getAttribute("data-row-gap")) : null,
                    alignItems: dom.getAttribute("data-align-items") || 'stretch',
                    justifyItems: dom.getAttribute("data-justify-items") || 'stretch'
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-grid": "",
                        "data-columns": node.attrs.columns,
                        "data-rows": node.attrs.rows,
                        "data-gap": node.attrs.gap,
                        "data-column-gap": node.attrs.columnGap,
                        "data-row-gap": node.attrs.rowGap,
                        "data-align-items": node.attrs.alignItems,
                        "data-justify-items": node.attrs.justifyItems
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return GridView
    }

    get menuItem() {
        return [
            {
                icon: '🔲',
                title: 'Grid',
                action: () => this.editor.chain().setGrid().run(),
                isActive: () => this.isActive(),
                group: "layout",
            }
        ]
    }

    get commands() {
        return {
            setGrid: (attrs = { columns: 2, rows: 2 }) => (state, dispatch) => {
                const { schema } = state;
                
                // Calculate number of items needed
                const columns = attrs.columns || 2;
                const rows = attrs.rows === 'auto' || !attrs.rows ? 2 : attrs.rows;
                const itemCount = columns * rows;
                
                // Create GridItems, each with empty paragraph and positioned
                const gridItems = Array.from({ length: itemCount }, (_, index) => {
                    const col = (index % columns) + 1;
                    const row = Math.floor(index / columns) + 1;
                    
                    return schema.nodes.griditem.create(
                        { 
                            columnStart: col,
                            rowStart: row,
                            columnSpan: 1,
                            rowSpan: 1
                        },
                        schema.nodes.paragraph.create()
                    );
                });
                
                // Create Grid with GridItems as children
                const grid = schema.nodes.grid.create(
                    { ...attrs, rows: attrs.rows || 'auto' },
                    gridItems
                );
                
                // Replace selection with Grid
                const tr = state.tr.replaceSelectionWith(grid);
                dispatch?.(tr);
                return true;
            },
            updateGridLayout: (attrs) => (state, dispatch) => {
                const { $from } = state.selection;
                let depth = $from.depth;
                
                while (depth >= 0) {
                    const node = $from.node(depth);
                    if (node.type.name === this.name) {
                        const pos = $from.before(depth);
                        const tr = state.tr.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            ...attrs
                        });
                        dispatch?.(tr);
                        return true;
                    }
                    depth--;
                }
                return false;
            }
        }
    }

    isActive() {
        const { $from } = this.editor.state.selection;
        let depth = $from.depth;
        while (depth >= 0) {
            const node = $from.node(depth);
            if (node.type.name === this.name) return true;
            depth--;
        }
        return false;
    }
}
