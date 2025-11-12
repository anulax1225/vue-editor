import { Node } from '@/editor/node.js'
import { ClickCounterView } from '@/components/editor/views'
import { createAtomCommand } from '@/editor/utils'

export class ClickCounter extends Node {
  get schema() {
    return {
      attrs: {
        count: { default: 0 },
        label: { default: 'Click me!' },
      },
      atom: true,
      selectable: false,
      group: 'block',
      inline: false,
      draggable: false,
      parseDOM: [
        {
          tag: 'div[data-click-counter]',
          getAttrs: dom => ({
            count: parseInt(dom.getAttribute('data-count')) || 0,
            label: dom.getAttribute('data-label') || 'Click me!',
          }),
        },
      ],
      toDOM: node => [
        'div',
        {
          'data-click-counter': '',
          'data-count': node.attrs.count,
          'data-label': node.attrs.label,
        },
      ],
    }
  }

  get component() {
    return ClickCounterView
  }

  get menuItem() {
    return [
        {
            icon: '🔢',
            title: 'Click Counter',
            action: () => this.editor.chain().setClickCounter().run(),
            
        }
    ]
  }

    get commands() {
        return {
            setClickCounter: () => createAtomCommand(this.name),
        };
    }
}