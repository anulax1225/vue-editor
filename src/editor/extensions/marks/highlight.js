import { Mark } from '@/editor/mark.js'
import { toggleMark } from 'prosemirror-commands'

export class Highlight extends Mark {
    get schema() {
        return {
            attrs: {
                color: { default: '#ffff00' },
            },
            parseDOM: [
                {
                    tag: 'mark',
                    getAttrs: dom => ({
                        color: dom.style.backgroundColor || '#ffff00',
                    }),
                },
                {
                    style: 'background-color',
                    getAttrs: value => {
                        if (!value || value === 'transparent') return false
                        return { color: value }
                    },
                },
            ],
            toDOM(mark) {
                return [
                    'mark',
                    {
                        style: `background-color: ${mark.attrs.color}`,
                    },
                    0,
                ]
            },
        }
    }

    get menuItem() {
        return [
            {
                icon: '🖍️',
                title: 'Highlight',
                action: () => this.editor.chain().toggleHighlight().run(),
                isActive: () => this.isActive(),
                group: 'text',
            },
        ]
    }

    get keymap() {
        return {
            'Mod-Shift-h': () => this.editor.chain().toggleHighlight().run(),
            'Mod-Shift-H': () => this.editor.chain().toggleHighlight().run(),
        }
    }

    get commands() {
        return {
            toggleHighlight: (color = '#ffff00') => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                return toggleMark(markType, { color })(state, dispatch, view)
            },
            setHighlight: (color) => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                const tr = state.tr.addMark(from, to, markType.create({ color }))
                if (dispatch) dispatch(tr)
                return true
            },
        }
    }
}
