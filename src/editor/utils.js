import { setBlockType } from "prosemirror-commands";
import { InputRule } from "prosemirror-inputrules";

export function markdownNodeInputRule(regex, node, matchStatement = match => null) {
    return new InputRule(
        regex,
        (state, match, start, end) => {
            const { tr } = state;
            tr.delete(start, end);
            const $start = tr.doc.resolve(start);
            const from = $start.before();
            const to = $start.after();
            tr.setBlockType(from, to, state.schema.nodes[node], matchStatement(match));
            return tr;
        }
    );
}

export function markdownMarkInputRule(regex, mark, matchStatement = match => null) {
    return new InputRule(
        regex,
        (state, match, start, end) => {
            const { tr } = state;
            tr.insertText(match[1],start, end);
            const $start = tr.doc.resolve(start);
            const from = $start.before();
            const to = $start.after();
            tr.addMark(from, to, state.schema.marks[mark].create(matchStatement(match)));
            return tr;
        }
    );
}

export function createBlockCommand(name, attr = null) {
    return (state, dispatch, view) => setBlockType(state.schema.nodes[name], attr)(state, dispatch, view)
} 

export function createAtomCommand(name, attr = null) {
    return (state, dispatch, view) => {
        const tr = state.tr.replaceSelectionWith(
            state.schema.nodes[name].create(attr)
        );
        dispatch(tr);
        return true
    }

}