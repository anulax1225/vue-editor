import { TextColor } from '@/proditor/extensions/marks/textColor.js'
import { TextColorItem } from '@/proditor-vue/components'

export class TextColorWithComponent extends TextColor {
    get name() {
        return "textcolor";
    }

    get menuItem() {
        return [
            {
                icon: 'A',
                title: 'Text Color',
                component: TextColorItem,
                currentColor: '#FFFFFF',
                action: () => {
                    // Toggle mark with current color
                    const currentColor = this.getCurrentColor()
                    this.editor.chain().setTextColor(currentColor || '#FFFFFF').run()
                },
                onColorSelect: (color) => {
                    // Apply selected color
                    this.editor.chain().setTextColor(color).run()
                },
                isActive: () => this.isActive(),
                isDisabled: () => false,
                group: 'text',
                showInBubble: true,
            }
        ]
    }

    getCurrentColor() {
        const { from, to } = this.editor.state.selection
        const mark = this.editor.schema.marks[this.name]
        
        // Get marks at current selection
        const marks = this.editor.state.selection.$from.marks()
        const colorMark = marks.find(m => m.type === mark)
        
        return colorMark ? colorMark.attrs.color : null
    }
}