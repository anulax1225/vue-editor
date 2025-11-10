import { Node } from '@/editor/node.js'
import { schema as basicSchema } from 'prosemirror-schema-basic'

export class Doc extends Node {
  get schema() {
    return basicSchema.spec.nodes.get('doc')
  }

  get showInMenu() {
    return false
  }
}