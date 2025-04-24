<script setup>
import { Head, Link } from '@inertiajs/vue3';
import Editor from "@/Components/Editor/Editor.vue";
import { ref } from 'vue';
import CodeViewer from '@/Components/CodeViewer.vue';

const page = ref("");
const mode = ref(false);
</script>

<template>
    <Head title="Welcome" />
    <div class="mx-5 mt-5 rounded shadow">
        <div class="w-full p-4 text-lg font-medium border-b border-t border-gray-100">
            <button 
            @click="mode = !mode"
            class="bg-gray-200 text-gray-700 px-2 w-fit rounded shadow">{{mode ? "Raw" : "Normal" }}</button>
        </div>
        <div class="grid grid-cols-2">
            <Editor @update="(data) => page = data.html" class="border-r border-gray-100"/>
            <CodeViewer v-if="!mode" :code="page"/>
            <div v-else class="tiptap-editor" v-html="page">
            </div>
        </div>
    </div>
</template>
