import { setBlockType } from "prosemirror-commands";
import { InputRule } from "prosemirror-inputrules";

export function markdownInputRule(regex, node, matchStatement = match => null) {
    return new InputRule(
        regex,
        (state, match, start, end) => {
            const { tr } = state;

            // Delete trigger text
            tr.delete(start, end);

            // Get position and apply transformation
            const $start = tr.doc.resolve(start);
            const from = $start.before();
            const to = $start.after();

            tr.setBlockType(from, to, state.schema.nodes[node], matchStatement(match));
            return tr;
        }
    );
}

export function createBlockCommand(name, attr = null) {
    return (state, dispatch, view) => setBlockType(state.schema.nodes[name], attr)(state, dispatch, view)
} 