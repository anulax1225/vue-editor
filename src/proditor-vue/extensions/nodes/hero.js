import { Node } from '@/proditor/node.js'
import { HeroView } from '../../components'
import { createAtomCommand } from '@/proditor/utils.js'

export class Hero extends Node {
    get schema() {
        return {
            content: "block+",
            group: "block",
            defining: true,
            attrs: {
                height: { default: 'auto' },
                backgroundImage: { default: null },
                backgroundVideo: { default: null },
                overlay: { default: 0 },
                overlayColor: { default: '#000000' },
                textAlign: { default: 'center' },
                verticalAlign: { default: 'center' },
                padding: { default: 'large' }
            },
            parseDOM: [{
                tag: "div[data-hero]",
                getAttrs: dom => ({
                    height: dom.getAttribute("data-height") || 'auto',
                    backgroundImage: dom.getAttribute("data-background-image") || null,
                    backgroundVideo: dom.getAttribute("data-background-video") || null,
                    overlay: parseInt(dom.getAttribute("data-overlay")) || 0,
                    overlayColor: dom.getAttribute("data-overlay-color") || '#000000',
                    textAlign: dom.getAttribute("data-text-align") || 'center',
                    verticalAlign: dom.getAttribute("data-vertical-align") || 'center',
                    padding: dom.getAttribute("data-padding") || 'large'
                })
            }],
            toDOM(node) {
                return [
                    "div",
                    {
                        "data-hero": "",
                        "data-height": node.attrs.height,
                        "data-background-image": node.attrs.backgroundImage,
                        "data-background-video": node.attrs.backgroundVideo,
                        "data-overlay": node.attrs.overlay,
                        "data-overlay-color": node.attrs.overlayColor,
                        "data-text-align": node.attrs.textAlign,
                        "data-vertical-align": node.attrs.verticalAlign,
                        "data-padding": node.attrs.padding,
                        class: "hero"
                    },
                    0
                ]
            }
        }
    }

    get component() {
        return HeroView
    }

    get menuItem() {
        return [
            {
                icon: '🎭',
                title: 'Hero Section',
                action: () => this.editor.chain().setHero().run(),
                isActive: () => this.isActive(),
                group: "layout",
            }
        ]
    }

    get commands() {
        return {
            setHero: (attrs = {}) => createAtomCommand(this.name, attrs, true)
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
