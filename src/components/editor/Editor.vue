<template>
    <component v-if="editor && editor.isEditable" :is="props.toolbar" ref="toolbar" class="mb-3"/>
    <div class="border border-gray-300 rounded min-h-96">
        <div ref="element" class="h-full w-full md-content"></div>

    </div>
</template>

<script setup>
import { onMounted, ref, provide, shallowRef, onUnmounted } from 'vue';
import FlatToolbar from './toolbars/FlatToolbar.vue';

import { Editor } from "@/editor";
import { VueNodeAdapter } from '@/vue-adapter';

const props = defineProps({
    toolbar: {
        type: Object,
        default: null
    },
    content: {
        type: Object,
        default: {
            type: Editor.ContentType.MARKDOWN,
            value: `
# Titre 1
## Titre 2
### Titre 3

> # ouii
> nonn

\`\`\`
texte
\`\`\` 
            `,
        },
    },
    extensions: {
        type: Array,
        default: [],
    },
});

const toolbar = ref(null);
const emit = defineEmits(['init', 'update'])
const element = ref(null);
const editor = shallowRef(null);

provide('editor', editor);

onMounted(() => {
    editor.value = new Editor({
        element: element.value,
        extensions: [...props.extensions],
        content: props.content,
        nodeAdapter: VueNodeAdapter,
        editable: true,
    });
    editor.value.on("update", e => emit("update", e))
    editor.value.on("transaction", ({ editor }) => {
        if (editor.isEditable) toolbar.value.forceRerender();
    });
    emit("init", editor)
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