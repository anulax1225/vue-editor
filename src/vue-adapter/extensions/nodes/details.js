import { Node } from '@/editor/node.js'
import { DetailsView } from '@/components/editor/views'
import { createAtomCommand, createBlockCommand } from '@/editor/utils.js'
import { createParagraphNear, splitBlock } from 'prosemirror-commands'

export class Details extends Node {
    get schema() {
        return {
            content: "block+",
            group: "block",
            defining: true,
            attrs: {
                open: { default: true },
                summary: { default: "Details" }
            },
            parseDOM: [{
                tag: "details",
                getAttrs: dom => ({
                    open: dom.hasAttribute("open") || false,
                    summary: dom.querySelector("summary")?.textContent || "Details"
                })
            }],
            toDOM(node) {
                const attrs = node.attrs.open ? { open: false } : {}
                return [
                    "details",
                    attrs,
                    ["summary", node.attrs.summary],
                    this.schemaContent,
                ]
            }
        }
    }

    get component() {
        return DetailsView
    }

    get menuItem() {
        return [
            {
                icon: '▸',
                title: 'Details',
                action: () => this.editor.chain().setDetails().run(),
                isActive: () => this.isActive(),
                group: "blocks",
            }
        ]
    }

    get commands() {
        return {
            setDetails: (summary = "Details") => createAtomCommand(this.name, { open: true, summary }, true),
            toggleDetails: () => (state, dispatch) => {
                const { $from } = state.selection
                let depth = $from.depth

                while (depth >= 0) {
                    const node = $from.node(depth)
                    if (node.type.name === this.name) {
                        const pos = $from.before(depth)
                        const tr = state.tr.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            open: !node.attrs.open
                        })
                        dispatch?.(tr)
                        return true
                    }
                    depth--
                }
                return false
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
