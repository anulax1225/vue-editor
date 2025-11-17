<template>
    <div :class="props.asSidebar ? 'flex h-full items-stretch border-t' : ''">
        <component 
        v-if="editor && editor.isEditable" 
        :is="props.toolbar" ref="toolbar" 
        class="border-gray-800 pt-3" 
        :class="props.asSidebar ? 'max-w-44 border-r border-b pr-3' : 'border-b pb-3 mb-3'"/>
        <div class="w-full">
            <div class="text-2xl font-bold text-white px-3 py-3 border-b" contenteditable="">Nouveau document</div>
            <!-- Prosemirror editor content -->
            <div @focus="editor.focus('end')" ref="element" class="md-content w-full px-3 border-b"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, provide, shallowRef, onUnmounted } from 'vue';
import { Editor } from "@/proditor";
import { VueNodeAdapter } from '@/proditor-vue';

const props = defineProps({
    toolbar: {
        type: Object,
        default: null
    },
    asSidebar: {
        type: Boolean,
        default: true,
    },
    content: {
        type: Object,
        default: {
            type: Editor.ContentType.MARKDOWN,
            value: `
# Informations Générales

**Type de produit** :  Chaise de bar

**Formats disponibles**  
- \`.prefab\`
- \`.fbx\`

| Caractéristiques |  |
|----------------------------|--|
| Matériaux            | Structure en métal, assise rembourrée finition en tissu|
| Style                     |  Contemporain, Industriel |

### Utilisation recommandée
- Salle à manger
- Cuisine
- Lieu de restauration

| Dimensions           |  |
|------------------------------|--|
| **Largeur**            | 45 cm |
| **Profondeur**      | 48 cm |
| **Hauteur totale** | 100 cm |
| **Hauteur d'assise** | 78 cm |
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