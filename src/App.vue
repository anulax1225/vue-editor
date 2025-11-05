<script setup>
import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import  { baseKeymap } from "prosemirror-commands"
import { onMounted, ref } from "vue"

const editorView = ref(null)

onMounted(() => {
    let state = EditorState.create({
        schema,
        plugins: [
            history(),
            keymap({"Mod-z": undo, "Mod-y": redo}),
            keymap(baseKeymap)
        ],
    });
    let view = new EditorView(editorView.value, {
        state,
        dispatchTransaction(transaction) {
            console.log("Document size went from", transaction.before.content.size, "to", transaction.doc.content.size)
            let newState = view.state.apply(transaction)
            view.updateState(newState)
        }
    });
});
</script>

<template>
   <div ref="editorView" class="m-4 border border-gray-900">

   </div>
</template>
