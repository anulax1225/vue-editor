import { Mark } from '@/editor/mark.js'
import { toggleMark } from 'prosemirror-commands'

export class TextColor extends Mark {
    get schema() {
        return {
            attrs: {
                color: { default: '#000000' },
            },
            parseDOM: [
                {
                    tag: 'span[style*="color"]',
                    getAttrs: dom => {
                        const color = dom.style.color
                        return color ? { color } : false
                    },
                },
                {
                    style: 'color',
                    getAttrs: value => {
                        if (!value) return false
                        return { color: value }
                    },
                },
            ],
            toDOM(mark) {
                return [
                    'span',
                    {
                        style: `color: ${mark.attrs.color}`,
                    },
                    0,
                ]
            },
        }
    }

    get menuItem() {
        return [
            {
                icon: 'A',
                title: 'Text Color',
                action: () => this.editor.chain().setTextColor('#ff0000').run(),
                isActive: () => this.isActive(),
                group: 'text',
            },
        ]
    }

    get commands() {
        return {
            setTextColor: (color) => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                
                if (from === to) return false
                
                const tr = state.tr.addMark(from, to, markType.create({ color }))
                if (dispatch) dispatch(tr)
                return true
            },
            unsetTextColor: () => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                const tr = state.tr.removeMark(from, to, markType)
                if (dispatch) dispatch(tr)
                return true
            },
        }
    }
}
