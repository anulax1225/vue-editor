<script setup>
import { FlatToolbar, Editor, TabToolbar, TabComponentToolbar, FlatComponentToolbar, vueBase } from "@/proditor-vue"
import { baseExtensions, base, removeExtension } from '@/proditor';
import { reactive } from "vue";

const extensions = removeExtension([ 
    ...baseExtensions, 
    vueBase.TextColorWithComponent, 
    vueBase.HeadingWithComponent,
    vueBase.TableWithComponent, 
], base.nodes.Image);
const content = {
    type: "json",
    value: JSON.parse(localStorage.getItem("doc")) || null,
}
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
            :extensions="extensions" 
            :toolbar="FlatComponentToolbar" 
        />
    </div>
</template>
