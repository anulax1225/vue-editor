import { Node } from '@/editor/node.js'
import { CardView } from '@/components/editor/views'

export class Card extends Node {
    get schema() {
        return {
            content: "cardheader cardbody cardfooter",
            group: "block",
            defining: true,
            attrs: {
                variant: { default: 'default' },        // 'default', 'outlined', 'elevated', 'flat'
                shadow: { default: 'medium' },          // 'none', 'small', 'medium', 'large'
                borderRadius: { default: 'medium' },    // 'none', 'small', 'medium', 'large', 'rounded'
                backgroundColor: { default: '#ffffff' }, // Hex color
                borderColor: { default: '#e5e7eb' },    // Hex color
                borderWidth: { default: '1px' },        // CSS border width
                padding: { default: '0' },              // Card wrapper padding (usually 0)
                maxWidth: { default: 'none' },          // 'none', 'sm', 'md', 'lg', 'xl', '2xl', or CSS value
                align: { default: 'left' },             // 'left', 'center', 'right'
                clickable: { default: false }           // Boolean - adds hover effects
            },
            parseDOM: [{
                tag: "div[data-card]",
                getAttrs: dom => ({
                    variant: dom.getAttribute("data-variant") || 'default',
                    shadow: dom.getAttribute("data-shadow") || 'medium',
                    borderRadius: dom.getAttribute("data-border-radius") || 'medium',
                    backgroundColor: dom.getAttribute("data-bg-color") || '#ffffff',
                    borderColor: dom.getAttribute("data-border-color") || '#e5e7eb',
                    borderWidth: dom.getAttribute("data-border-width") || '1px',
                    padding: dom.getAttribute("data-padding") || '0',
                    maxWidth: dom.getAttribute("data-max-width") || 'none',
                    align: dom.getAttribute("data-align") || 'left',
                    clickable: dom.getAttribute("data-clickable") === 'true'
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-card": "",
                        "data-variant": node.attrs.variant,
                        "data-shadow": node.attrs.shadow,
                        "data-border-radius": node.attrs.borderRadius,
                        "data-bg-color": node.attrs.backgroundColor,
                        "data-border-color": node.attrs.borderColor,
                        "data-border-width": node.attrs.borderWidth,
                        "data-padding": node.attrs.padding,
                        "data-max-width": node.attrs.maxWidth,
                        "data-align": node.attrs.align,
                        "data-clickable": node.attrs.clickable,
                        class: `card card-${node.attrs.variant}`
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return CardView
    }

    get menuItem() {
        return [
            {
                icon: '🃏',
                title: 'Card',
                action: () => this.editor.chain().setCard().run(),
                group: "layout",
                isActive: () => this.isActive(),
            }
        ]
    }

    get commands() {
        return {
            setCard: (attrs = {}) => (state, dispatch) => {
                const { schema } = state;
                
                // Create three sections with initial paragraphs
                const header = schema.nodes.cardheader.create(
                    {},
                    schema.nodes.paragraph.create()
                );
                const body = schema.nodes.cardbody.create(
                    {},
                    schema.nodes.paragraph.create()
                );
                const footer = schema.nodes.cardfooter.create(
                    {},
                    schema.nodes.paragraph.create()
                );
                
                // Create Card with all three sections
                const card = schema.nodes.card.create(
                    { variant: 'default', ...attrs },
                    [header, body, footer]
                );
                
                const tr = state.tr.replaceSelectionWith(card);
                dispatch(tr);
                return true;
            },
            changeCardVariant: (variant) => (state, dispatch) => {
                const { $from } = state.selection;
                let depth = $from.depth;
                
                while (depth >= 0) {
                    const node = $from.node(depth);
                    if (node.type.name === 'card') {
                        const pos = $from.before(depth);
                        const tr = state.tr.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            variant
                        });
                        dispatch(tr);
                        return true;
                    }
                    depth--;
                }
                return false;
            },
            updateCardAttrs: (attrs) => (state, dispatch) => {
                const { $from } = state.selection;
                let depth = $from.depth;
                
                while (depth >= 0) {
                    const node = $from.node(depth);
                    if (node.type.name === 'card') {
                        const pos = $from.before(depth);
                        const tr = state.tr.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            ...attrs
                        });
                        dispatch(tr);
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
