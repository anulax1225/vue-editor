import { Node } from '@/proditor/node.js'
import { CardHeaderView } from '../../components'
import { createAtomCommand } from '@/proditor/utils.js'

export class CardHeader extends Node {
    get schema() {
        return {
            content: "block+",
            group: "cardheader",
            defining: true,
            attrs: {
                backgroundColor: { default: 'transparent' },
                borderBottom: { default: true },         // Show bottom border
                padding: { default: '16px' },            // Header padding
                textAlign: { default: 'left' }          // 'left', 'center', 'right'
            },
            parseDOM: [{
                tag: "div[data-card-header]",
                getAttrs: dom => ({
                    backgroundColor: dom.getAttribute("data-bg-color") || 'transparent',
                    borderBottom: dom.getAttribute("data-border-bottom") !== 'false',
                    padding: dom.getAttribute("data-padding") || '16px',
                    textAlign: dom.getAttribute("data-text-align") || 'left'
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-card-header": "",
                        "data-bg-color": node.attrs.backgroundColor,
                        "data-border-bottom": node.attrs.borderBottom,
                        "data-padding": node.attrs.padding,
                        "data-text-align": node.attrs.textAlign,
                        class: "card-header"
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return CardHeaderView
    }

    get showInMenu() {
        return false  // Don't show in menu - only created by Card
    }

    get commands() {
        return {
            // Only used internally by Card initialization
            setCardHeader: () => createAtomCommand(this.name, {}, true)
        }
    }
}
