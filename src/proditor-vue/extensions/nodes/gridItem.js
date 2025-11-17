import { Node } from '@/proditor/node.js'
import { GridItemView } from '../../components'
import { createAtomCommand } from '@/proditor/utils.js'

export class GridItem extends Node {
    get schema() {
        return {
            content: "block+",
            group: "griditem",
            defining: true,
            draggable: true,
            attrs: {
                columnStart: { default: null },
                columnEnd: { default: null },
                columnSpan: { default: 1 },
                rowStart: { default: null },
                rowEnd: { default: null },
                rowSpan: { default: 1 },
                alignSelf: { default: null },
                justifySelf: { default: null },
                order: { default: null }
            },
            parseDOM: [{
                tag: "div[data-grid-item]",
                getAttrs: dom => ({
                    columnStart: dom.getAttribute("data-column-start") ? parseInt(dom.getAttribute("data-column-start")) : null,
                    columnEnd: dom.getAttribute("data-column-end") ? parseInt(dom.getAttribute("data-column-end")) : null,
                    columnSpan: parseInt(dom.getAttribute("data-column-span")) || 1,
                    rowStart: dom.getAttribute("data-row-start") ? parseInt(dom.getAttribute("data-row-start")) : null,
                    rowEnd: dom.getAttribute("data-row-end") ? parseInt(dom.getAttribute("data-row-end")) : null,
                    rowSpan: parseInt(dom.getAttribute("data-row-span")) || 1,
                    alignSelf: dom.getAttribute("data-align-self") || null,
                    justifySelf: dom.getAttribute("data-justify-self") || null,
                    order: dom.getAttribute("data-order") ? parseInt(dom.getAttribute("data-order")) : null
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-grid-item": "",
                        "data-column-start": node.attrs.columnStart,
                        "data-column-end": node.attrs.columnEnd,
                        "data-column-span": node.attrs.columnSpan,
                        "data-row-start": node.attrs.rowStart,
                        "data-row-end": node.attrs.rowEnd,
                        "data-row-span": node.attrs.rowSpan,
                        "data-align-self": node.attrs.alignSelf,
                        "data-justify-self": node.attrs.justifySelf,
                        "data-order": node.attrs.order
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return GridItemView
    }

    get showInMenu() {
        return false
    }

    get commands() {
        return {
            setGridItem: () => createAtomCommand(this.name, {}, true),
            updateGridItemPosition: (attrs) => (state, dispatch) => {
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
}
