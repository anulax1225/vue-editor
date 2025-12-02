import { Heading } from '@/proditor/extensions/nodes/heading.js'
import { HeadingSelectorItem } from '@/proditor-vue/components'

export class HeadingWithComponent extends Heading {
    get name() {
        return "heading";
    }
    get menuItem() {
        return [
            {
                icon: 'H',
                title: 'Heading',
                component: HeadingSelectorItem,
                get currentLevel() {
                    // Dynamically get current level from editor state
                    const { $from } = this._editor.state.selection
                    const parent = $from.parent
                    if (parent.type.name === 'heading') {
                        return parent.attrs.level
                    }
                    return 1
                },
                _editor: this.editor,
                action: () => {
                    // Apply heading with current level
                    const level = this.getCurrentLevel() || 1
                    this.editor.chain().setHeading(level).run()
                },
                onLevelSelect: (level) => {
                    this.editor.chain().setHeading(level).run()
                },
                isActive: () => this.isActive(),
                isDisabled: () => false,
                group: 'text',
            }
        ]
    }

    getCurrentLevel() {
        const { $from } = this.editor.state.selection
        if (this.isActive()) {
            return $from.parent.attrs.level
        }
        return null
    }
}