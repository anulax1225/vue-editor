<template>
    <Toolbar ref="toolbar" class="mb-3" v-if="editor" :editor="editor" />
    <div class="border border-gray-300 rounded min-h-96">
        <div ref="element" class="h-full w-full md-content"></div>

        <!-- <BubbleMenu v-if="editor" :editor="editor" :items="bubbleMenuItems" /> -->
    </div>
</template>

<script setup>
import { onMounted, ref, provide, shallowRef, onUnmounted  } from 'vue';
import Toolbar from './EditorToolbar.vue';

import { Editor } from "@/editor";

const props = defineProps({
    content: {
        type: String,
        default: `
# Titre 1
## Titre 2
### Titre 3

texte 
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
const editor = shallowRef(null);

provide('editor', editor);

onMounted(() => {
    editor.value = new Editor({
        element: element.value,
        extensions: [...props.extensions],
        content: {
            type: Editor.ContentType.MARKDOWN,
            value: props.content,
        }
    });
    editor.value.on("update", ({ editor }) => {
        
    })

    editor.value.on("transaction", ({ editor }) => {
        toolbar.value.forceRerender();
    })
})

onUnmounted(() => {
    editor.value.destroy();
})
</script>

<style>
    [contenteditable]:focus {
        outline: none;
    }
</style>