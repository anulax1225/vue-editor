<template>
    <Toolbar ref="toolbar" class="mb-3" v-if="editor" :editor="editor" />
    <div class="border border-gray-300 rounded min-h-96">
        <div ref="element" class="h-full w-full md-content"></div>

        <!-- <BubbleMenu v-if="editor" :editor="editor" :items="bubbleMenuItems" /> -->
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Toolbar from './EditorToolbar.vue';

import { Editor, extensions } from "@/editor";

const props = defineProps({
    content: {
        type: String,
        default: `
            <h1>Titre 1</h1>
            <h2>Titre 2</h2>
            <h3>Titre 3</h3>
            <p>text</p>
        `,
    },
    extensions: {
        type: Array,
        default: [],
    },
});

const toolbar = ref(null);
const emit = defineEmits(['update'])
const element = ref(null);
const editor = ref(null);

onMounted(() => {
    editor.value = new Editor({
        element: element.value,
        extensions: [...extensions, ...props.extensions],
        content: props.content,
    }); 
    editor.value.on("update", ({ editor }) => {
        //console.log(editor.getHTML())
    })

    editor.value.on("transaction", ({ editor }) => {
        //console.log("event transaction");
        toolbar.value.forceRerender();
    })
})
</script>

<style>
    [contenteditable]:focus {
        outline: none;
    }
</style>