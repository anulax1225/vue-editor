import { Plugin as ProsePlugin, PluginKey as ProsePluginKey } from 'prosemirror-state'
import { Plugin } from '@/proditor/plugin.js'

export class BubbleMenu extends Plugin {
    get plugins() {
        return [
            createBubbleMenuPlugin(this.options.updateCallback || function() {})
        ]
    }
}

export function createBubbleMenuPlugin(updateCallback) {
    return new ProsePlugin({
        key: new ProsePluginKey('bubbleMenu'),

        view(editorView) {
            return {
                update(view, prevState) {
                    const { state } = view
                    const { selection } = state
                    const { from, to, empty } = selection

                    // Hide if no selection or selection is empty
                    if (empty) {
                        updateCallback({ show: false })
                        return
                    }

                    // Calculate position
                    const start = view.coordsAtPos(from)
                    const end = view.coordsAtPos(to)
                    const editorRect = view.dom.getBoundingClientRect()

                    updateCallback({
                        show: true,
                        top: start.top - editorRect.top, // 50px above selection
                        left: (start.left + end.right) / 2 - editorRect.left
                    })
                }
            }
        }
    })
}