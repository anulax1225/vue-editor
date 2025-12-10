<template>
    <div :class="props.asSidebar ? 'flex h-full items-stretch' : ''" class="relative">
        <slot name="header"></slot>
        <component v-if="editor && editable && props.toolbar" :is="props.toolbar" ref="toolbar" class="border-gray-800"
            :class="props.asSidebar ? 'max-w-44 border-r pr-3 pt-3' : 'border-b border-gray-800 py-3 sticky top-0 left-0 right-0 bg-gray-800 z-10'" />
        <div class="relative w-full">
            <div @focus="editor.focus('end')" ref="editorElement" class="w-full border-b ProseMirror">
                <component v-if="editor && editable && props.bubbleMenu" :is="props.bubbleMenu" ref="bubbleMenu"/>
                <slot name="content"></slot>
            </div>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script setup>
import { onMounted, ref, provide, shallowRef, onUnmounted, toRaw } from 'vue';
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
        default: false,
    },
    isEditable: {
        type: Boolean,
        default: true,
    },
    content: {
        type: Object,
        default: {
            type: Editor.ContentType.MARKDOWN,
            value: ``,
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
        if (editor.isEditable) toolbar.value?.forceRerender();
    });
    emit("init", toRaw(editor.value));
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