import { Mark } from '@/editor/mark.js'

export class FontSize extends Mark {
    get schema() {
        return {
            attrs: {
                size: { default: '16px' },
            },
            parseDOM: [
                {
                    tag: 'span[style*="font-size"]',
                    getAttrs: dom => {
                        const size = dom.style.fontSize
                        return size ? { size } : false
                    },
                },
                {
                    style: 'font-size',
                    getAttrs: value => {
                        if (!value) return false
                        return { size: value }
                    },
                },
            ],
            toDOM(mark) {
                return [
                    'span',
                    {
                        style: `font-size: ${mark.attrs.size}`,
                    },
                    0,
                ]
            },
        }
    }

    get menuItem() {
        return [
            {
                icon: 'T',
                title: 'Font Size',
                action: () => this.editor.chain().setFontSize('18px').run(),
                isActive: () => this.isActive(),
                group: 'text',
            },
        ]
    }

    get commands() {
        return {
            setFontSize: (size) => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                
                if (from === to) return false
                
                const tr = state.tr.addMark(from, to, markType.create({ size }))
                if (dispatch) dispatch(tr)
                return true
            },
            unsetFontSize: () => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                const tr = state.tr.removeMark(from, to, markType)
                if (dispatch) dispatch(tr)
                return true
            },
        }
    }
}
