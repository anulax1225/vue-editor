import { Node } from '@/editor/node.js'
import { CardFooterView } from '@/components/editor/views'
import { createAtomCommand } from '@/editor/utils.js'

export class CardFooter extends Node {
    get schema() {
        return {
            content: "block+",
            group: "cardfooter",
            defining: true,
            attrs: {
                backgroundColor: { default: 'transparent' },
                borderTop: { default: true },            // Show top border
                padding: { default: '16px' },            // Footer padding
                textAlign: { default: 'left' },          // 'left', 'center', 'right'
                justify: { default: 'start' }            // 'start', 'end', 'center', 'between', 'around'
            },
            parseDOM: [{
                tag: "div[data-card-footer]",
                getAttrs: dom => ({
                    backgroundColor: dom.getAttribute("data-bg-color") || 'transparent',
                    borderTop: dom.getAttribute("data-border-top") !== 'false',
                    padding: dom.getAttribute("data-padding") || '16px',
                    textAlign: dom.getAttribute("data-text-align") || 'left',
                    justify: dom.getAttribute("data-justify") || 'start'
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-card-footer": "",
                        "data-bg-color": node.attrs.backgroundColor,
                        "data-border-top": node.attrs.borderTop,
                        "data-padding": node.attrs.padding,
                        "data-text-align": node.attrs.textAlign,
                        "data-justify": node.attrs.justify,
                        class: "card-footer"
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return CardFooterView
    }

    get showInMenu() {
        return false
    }

    get commands() {
        return {
            setCardFooter: () => createAtomCommand(this.name, {}, true)
        }
    }
}
