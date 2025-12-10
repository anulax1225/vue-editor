<template>
    <button class="border rounded-lg px-2 py-1 my-2" @click="toggleEditing">
        {{ editable ? 'Preview' : 'Edition' }}
    </button>
    <div :class="props.asSidebar ? 'flex h-full items-stretch border-t' : ''">
        <component v-if="editor && editable && props.toolbar" :is="props.toolbar" ref="toolbar" class="border-gray-800 pt-3"
            :class="props.asSidebar ? 'max-w-44 border-r border-b pr-3' : 'border-b pb-3 mb-3'" />
        <div class="relative w-full">
            <div @focus="editor.focus('end')" ref="editorElement" class="md-content w-full px-3 border-b">
                <component v-if="editor && editable && props.bubbleMenu" :is="props.bubbleMenu" ref="bubbleMenu"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, provide, shallowRef, onUnmounted } from 'vue';
import { Editor } from "@/proditor";
import { VueNodeAdapter } from '@/proditor-vue';
import { BubbleMenu } from '@/proditor/extensions/plugins/bubbleMenu';

const props = defineProps({
    toolbar: {
        type: Object,
        default: null
    },
    bubbleMenu: {
        type: Object,
        default: null
    },
    asSidebar: {
        type: Boolean,
        default: true,
    },
    isEditable: {
        type: Boolean,
        default: true,
    },
    content: {
        type: Object,
        default: {
            type: Editor.ContentType.MARKDOWN,
            value: `
# Informations Générales
[google.com](https://google.com/)

**Type de produit** :  Chaise de bar

**Formats disponibles**  
- \`.prefab\`
- \`.fbx\`

| Caractéristiques |  |
|----------------------------|--|
| Matériaux            | Structure en métal, assise rembourrée finition en tissu|
| Style                     |  Contemporain, Industriel |
            `,
        },
    },
    extensions: {
        type: Array,
        default: [],
    },
});

const editable = ref(props.isEditable);
const toolbar = ref(null);
const bubbleMenu = ref(null);
const editorElement = ref(null);
const editor = shallowRef(null);

const emit = defineEmits(['init', 'update'])

const toggleEditing = () => {
    editable.value = !editable.value;
    editor.value.setEditable(editable.value);
}

provide('editor', editor);

onMounted(() => {
    editor.value = new Editor({
        element: editorElement.value,
        extensions: [
            new BubbleMenu({
                updateCallback: (position) => {
                    bubbleMenu.value?.updatePosition(position)
                }
            }),
            ...props.extensions
        ],
        content: props.content,
        nodeAdapter: VueNodeAdapter,
        editable: editable.value,
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