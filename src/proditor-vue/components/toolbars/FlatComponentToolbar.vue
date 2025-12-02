<template v-if="editor">
    <div>
        <div class="flex gap-1 items-center flex-wrap pb-1 mb-1 border-b">
            <!-- Iterate through items -->
            <template v-for="(item, index) in items.filter(item => !!item.component)" :key="`${item.title}-${index}`">

                <!-- Regular menu item with tooltip -->
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <component ref="componentItems" v-if="item.component" :is="item.component"
                                :menuItem="item" />
                            <Badge v-else variant="outline" @click="handleClick(item)"
                                class="pb-1 cursor-pointer transition duration-500"
                                :class="[item.isActive() ? 'bg-gray-800 shadow-lg' : 'hover:bg-gray-700']">
                                <component v-if="iconMap[item.title.toLowerCase()]"
                                    :is="iconMap[item.title.toLowerCase()]" class="w-4 h-4" />
                                <span v-else class="text-xs">{{ item.title }}</span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent class="bg-gray-600 fill-gray-600 text-white">
                            <p>{{ item.title }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </template>
        </div>
        <div class="flex gap-1 items-center flex-wrap">
            <template v-for="(item, index) in items.filter(item => !item.component)" :key="`${item.title}-${index}`">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <component ref="componentItems" v-if="item.component" :is="item.component"
                                :menuItem="item" />
                            <Badge v-else variant="outline" @click="handleClick(item)"
                                class="pb-1 cursor-pointer transition duration-500"
                                :class="[item.isActive() ? 'bg-gray-800 shadow-lg' : 'hover:bg-gray-700']">
                                <component v-if="iconMap[item.title.toLowerCase()]"
                                    :is="iconMap[item.title.toLowerCase()]" class="w-4 h-4" />
                                <span v-else class="text-xs">{{ item.title }}</span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent class="bg-gray-600 fill-gray-600 text-white">
                            <p>{{ item.title }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, inject, getCurrentInstance } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { forceRender } from '../../utils'
import {
    Text, Heading1, Heading2, Heading3, Bold, Italic,
    Underline, Highlighter, Strikethrough, Subscript, Superscript,
    Palette, ALargeSmall, Type, Code2, Minus, Quote, Table,
    Plus, Trash2, Combine, Split, ListOrdered, List
} from "lucide-vue-next"

const instance = getCurrentInstance()
const editor = inject('editor')

const items = computed(() => {
    return editor.value.getMenuItems();
})

const iconMap = {
    "paragraph": Text,
    "heading 1": Heading1,
    "heading 2": Heading2,
    "heading 3": Heading3,
    "bold": Bold,
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
    forceRerender: () => forceRender(instance.proxy, true)
})
</script>