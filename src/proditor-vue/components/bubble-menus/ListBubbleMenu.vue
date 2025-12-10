<template>
    <div class=" absolute bg-gray-900 rounded-lg shadow-lg transition-[opacity_transform]"
        :style="{
            top: (position.top + 60) + 'px',
            left: Math.max(position.left, 176/2) + 'px',
            transform: 'translateX(-50%)'
        }" :class="position.show ? 'opacity-100 scale-100 z-40' : 'opacity-0 scale-90 -z-20'">
        <div class="w-44">
            <div v-for="(items, group) in groupedItems" :key="group" class="border-b border-gray-800 last:border-b-0">
                <!-- Group Label (optional) -->
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">
                    {{ group }}
                </div>

                <!-- Group Items -->
                <div class="pb-2 flex flex-col">
                    <template v-for="(item, index) in items" :key="index">
                        <component v-if="item.component" :is="item.component" :menuItem="item" :editor="editor"
                            :isBubble="true" :class="item.isActive?.() ? 'bg-gray-700' : 'hover:bg-gray-700'"
                            class="px-3 py-0.5" />
                        <Badge v-else variant="outline" @click="handleClick(item)"
                            class="grid grid-cols-5 py-0.5 cursor-pointer transition duration-500 rounded-none border-none w-full justify-start px-3"
                            :class="item.isActive?.() ? 'bg-gray-700' : 'hover:bg-gray-700'">
                            <component v-if="iconMap[item.title.toLowerCase()]" :is="iconMap[item.title.toLowerCase()]"
                                class="w-4 h-4" />
                            <span v-else class="text-[10px]">{{ item.icon }}</span>
                            <span class="text-xs col-span-4">{{ item.title }}</span>
                        </Badge>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
    Text, Heading1, Heading2, Heading3, Bold, Italic,
    Underline, Highlighter, Strikethrough, Subscript, Superscript,
    Palette, ALargeSmall, Type, Code2, Minus, Quote, Table,
    Plus, Trash2, Combine, Split, ListOrdered, List,
    Code,
    Proportions,
    Link
} from "lucide-vue-next";

const editor = inject('editor')

const position = ref({
    show: false,
    top: 0,
    left: 0
})

const bubbleItems = computed(() => editor.value.getBubbleMenuItems((a, b) => {
    if (a.type === "mark") return -1;
    if (b.type === "mark") return 1;
    return 0;
}))

const groupedItems = computed(() => {
    return bubbleItems.value.reduce((acc, item) => {
        const group = item.group || 'general'
        if (!acc[group]) acc[group] = []
        acc[group].push(item)
        return acc
    }, {})
})

const iconMap = {
    "paragraph": Text,
    "heading 1": Heading1,
    "heading 2": Heading2,
    "heading 3": Heading3,
    "bold": Bold,
    "code": Code,
    "link": Link,
    "italic": Italic,
    "underline": Underline,
    "highlight": Highlighter,
    "strikethrough": Strikethrough,
    "subscript": Subscript,
    "superscript": Superscript,
    "text color": Palette,
    "font size": ALargeSmall,
    "font family": Type,
    "code block": Code2,
    "horizontal rule": Minus,
    "blockquote": Quote,
    "insert table": Table,
    "add row after": Plus,
    "delete row": Trash2,
    "add column after": Plus,
    "delete column": Trash2,
    "merge cells": Combine,
    "split cell": Split,
    "delete table": Trash2,
    "ordered list": ListOrdered,
    "bullet list": List,
}

const handleClick = (item) => {
    if (item.isDisabled?.()) return
    item.action?.()
    editor.value.focus()
}

defineExpose({
    updatePosition: (pos) => {
        position.value = pos
    }
})
</script>