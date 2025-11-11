import { Node } from '@/editor/node.js'
import { schema as markdownSchema } from 'prosemirror-markdown'

export class Doc extends Node {
  get schema() {
    return markdownSchema.spec.nodes.get('doc')
  }

  get showInMenu() {
    return false
  }
}