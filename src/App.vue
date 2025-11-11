<script setup>
import Editor from './components/editor/Editor.vue';
import { baseExtensions } from '@/editor';

</script>

<template>
    <div class="m-5">
        <Editor :extensions="baseExtensions"></Editor>
    </div>
</template>
