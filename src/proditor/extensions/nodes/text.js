import { Node } from '@/proditor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'

export class Text extends Node {
  get schema() {
    return markdownSchema.spec.nodes.get('text')
  }

  get showInMenu() {
    return false
  }
}