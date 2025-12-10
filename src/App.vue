<script setup>
import { Editor, FlatComponentToolbar, ListBubbleMenu, vueBase } from "@/proditor-vue"
import { baseExtensions, base, removeExtensions } from '@/proditor';
import { reactive } from "vue";

const extensions = removeExtensions([ 
    ...baseExtensions, 
    vueBase.TextColorWithComponent, 
    vueBase.TableWithComponent, 
], [base.nodes.Image, base.marks.FontFamily, base.marks.FontSize, base.marks.Highlight]);

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
    <div class="m-5 px-10">
        <Editor 
            @update="update" 
            :extensions="extensions" 
            :toolbar="FlatComponentToolbar"
            :asSidebar="false"
            :bubbleMenu="ListBubbleMenu"
        />
    </div>
</template>
