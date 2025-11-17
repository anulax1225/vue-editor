import { Node } from '@/editor/node.js'
import { CalloutView } from '@/components/editor/views'
import { createAtomCommand, createBlockCommand } from '@/editor/utils.js'

export class Callout extends Node {
    get schema() {
        return {
            content: "block+",
            group: "block",
            attrs: {
                variant: { default: "info" } // info, warning, error, success
            },
            defining: true,
            parseDOM: [{
                tag: "div[data-callout]",
                getAttrs: dom => ({
                    variant: dom.getAttribute("data-variant") || "info"
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-callout": "",
                        "data-variant": node.attrs.variant,
                        class: `callout callout-${node.attrs.variant}`
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return CalloutView
    }

    get menuItem() {
        return [
            {
                icon: 'ℹ️',
                title: 'Info Callout',
                action: () => this.editor.chain().setCallout('info').run(),
                isActive: () => this.isActive('info'),
                group: "blocks",
            },
            {
                icon: '⚠️',
                title: 'Warning Callout',
                action: () => this.editor.chain().setCallout('warning').run(),
                isActive: () => this.isActive('warning'),
                group: "blocks",
            },
            {
                icon: '❌',
                title: 'Error Callout',
                action: () => this.editor.chain().setCallout('error').run(),
                isActive: () => this.isActive('error'),
                group: "blocks",
            },
            {
                icon: '✅',
                title: 'Success Callout',
                action: () => this.editor.chain().setCallout('success').run(),
                isActive: () => this.isActive('success'),
                group: "blocks",
            }
        ]
    }

    get commands() {
        return {
            setCallout: (variant = "info") => createAtomCommand(this.name, { variant }),
            changeCalloutVariant: (variant) => (state, dispatch) => {
                const { $from } = state.selection
                let depth = $from.depth
                
                while (depth >= 0) {
                    const node = $from.node(depth)
                    if (node.type.name === this.name) {
                        const pos = $from.before(depth)
                        const tr = state.tr.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            variant
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

    isActive(variant) {
        const { $from } = this.editor.state.selection
        let depth = $from.depth
        while (depth >= 0) {
            const node = $from.node(depth)
            if (node.type.name === this.name) {
                return variant ? node.attrs.variant === variant : true
            }
            depth--
        }
        return false
    }
}
