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
            tr.insertText(match[1], start, end);
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

export function createAtomCommand(name, attr = null, asContent = false) {
    return (state, dispatch, view) => {
        const markup = asContent ? state.schema.nodes.paragraph.create() : null;
        const node = state.schema.nodes[name].create(attr, markup)
        const tr = state.tr.replaceSelectionWith(
            node,
        );
        dispatch(tr);
        return true
    }

}