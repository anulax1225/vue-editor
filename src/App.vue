<script setup>
import { FlatToolbar, Editor, TabToolbar } from "@/components/editor"
import { baseExtensions, base, removeExtension } from '@/editor';
import { vueExtensions } from "./vue-adapter";
import { reactive } from "vue";

const extensions = removeExtension([ ...baseExtensions, ...vueExtensions ], base.Image);
const content = reactive({
    type: "json",
    value: JSON.parse(localStorage.getItem("doc")) || null,
})
const update = ({ editor }) => {
    // console.log(editor.getContent("html"));
    // console.log(editor.getContent("json"));
    localStorage.setItem("doc", JSON.stringify(editor.getContent("json")));
}
</script>

<template>
    <div class="m-5">
        <Editor 
            @update="update" 
            :content="content" 
            :extensions="extensions" 
            :toolbar="TabToolbar" 
        />
    </div>
</template>
