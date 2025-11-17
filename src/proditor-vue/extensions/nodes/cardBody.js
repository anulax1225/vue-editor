import { Node } from '@/proditor/node.js'
import { CardBodyView } from '../../components'
import { createAtomCommand } from '@/proditor/utils.js'

export class CardBody extends Node {
    get schema() {
        return {
            content: "block+",
            group: "cardbody",
            defining: true,
            attrs: {
                padding: { default: '16px' },
                overflow: { default: 'visible' }  // 'visible', 'scroll', 'auto', 'hidden'
            },
            parseDOM: [{
                tag: "div[data-card-body]",
                getAttrs: dom => ({
                    padding: dom.getAttribute("data-padding") || '16px',
                    overflow: dom.getAttribute("data-overflow") || 'visible'
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-card-body": "",
                        "data-padding": node.attrs.padding,
                        "data-overflow": node.attrs.overflow,
                        class: "card-body"
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return CardBodyView
    }

    get showInMenu() {
        return false
    }

    get commands() {
        return {
            setCardBody: () => createAtomCommand(this.name, {}, true)
        }
    }
}
