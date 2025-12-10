import { Mark } from '@/proditor/mark.js'

export class FontFamily extends Mark {
    get schema() {
        return {
            attrs: {
                family: { default: 'inherit' },
            },
            parseDOM: [
                {
                    tag: 'span[style*="font-family"]',
                    getAttrs: dom => {
                        const family = dom.style.fontFamily
                        return family ? { family } : false
                    },
                },
                {
                    style: 'font-family',
                    getAttrs: value => {
                        if (!value) return false
                        return { family: value }
                    },
                },
            ],
            toDOM(mark) {
                return [
                    'span',
                    {
                        style: `font-family: ${mark.attrs.family}`,
                    },
                    0,
                ]
            },
        }
    }

    get menuItem() {
        return [
            {
                icon: 'Aa',
                title: 'Font Family',
                action: () => this.editor.chain().setFontFamily('monospace').run(),
                isActive: () => this.isActive(),
                group: 'text',
                showInBubble: true,
            },
        ]
    }

    get commands() {
        return {
            setFontFamily: (family) => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                
                const tr = state.tr.addMark(from, to, markType.create({ family }))
                if (dispatch) dispatch(tr)
                return true
            },
            unsetFontFamily: () => (state, dispatch, view) => {
                const markType = this.editor.schema.marks[this.name]
                const { from, to } = state.selection
                const tr = state.tr.removeMark(from, to, markType)
                if (dispatch) dispatch(tr)
                return true
            },
        }
    }
}
