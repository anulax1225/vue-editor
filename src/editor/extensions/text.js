import { Node } from '@/editor/node.js'
import { schema as basicSchema } from 'prosemirror-schema-basic'

export class Text extends Node {
  get schema() {
    return basicSchema.spec.nodes.get('text')
  }

  get showInMenu() {
    return false
  }
}