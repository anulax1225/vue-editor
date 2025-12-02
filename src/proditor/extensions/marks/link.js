import { Mark } from '@/proditor/mark.js'
import { markdownMarkInputRule } from '@/proditor/utils.js'

export class Link extends Mark {
    get name() {
        return "link";
    }

    get schema() {
        return {
            attrs: {
                href: {},
                title: { default: null }
            },
            inclusive: false,
            parseDOM: [{
                tag: "a[href]",
                getAttrs(dom) {
                    return {
                        href: dom.getAttribute("href"),
                        title: dom.getAttribute("title")
                    }
                }
            }],
            toDOM(node) {
                const { href, title } = node.attrs
                return ["a", { href, title }, 0]
            }
        }
    }

    get menuItem() {
        return [
            {
                icon: '🔗',
                title: 'Link',
                action: () => {
                    const href = prompt('Enter URL:', '')
                    if (href) {
                        this.editor.chain().setLink({ href }).run()
                    }
                },
                isActive: () => this.isActive(),
                group: "text",
            }
        ]
    }

    get keymap() {
        return {
            'Mod-k': () => {
                const href = prompt('Enter URL:', '')
                if (href) {
                    return this.editor.chain().setLink({ href }).run()
                }
                return false
            }
        }
    }

    inputRules(schema) {
        return [
            markdownMarkInputRule(/\[([^\]]+)\]\(([^)]+)\)$/, this.name, (match) => ({
                href: match[2]
            }))
        ]
    }

    get commands() {
        return {
            setLink: (attrs) => (state, dispatch) => {
                const { from, to } = state.selection
                const mark = this.editor.schema.marks[this.name].create(attrs)
                if (dispatch) {
                    dispatch(state.tr.addMark(from, to, mark))
                }
                return true
            },
            unsetLink: () => (state, dispatch) => {
                const { from, to } = state.selection
                if (dispatch) {
                    dispatch(state.tr.removeMark(from, to, this.editor.schema.marks[this.name]))
                }
                return true
            }
        }
    }
}