<!-- proditor-vue/components/BubbleMenu.vue -->
<template>
    <div v-if="position.show" class="absolute z-50 bg-gray-900 rounded-lg shadow-lg px-2 py-1 flex gap-1 items-center transition-[top_left_right_bottom]"
        :style="{
            top: (position.top + 60) + 'px',
            left: position.left + 'px',
            transform: 'translateX(-50%)'
        }">
        <template v-for="(item, index) in bubbleItems" :key="index">
            <component v-if="item.component" :is="item.component" :menuItem="item" :editor="editor" :isBubble="true" />
            <Badge v-else variant="outline" @click="handleClick(item)"
                class="pb-1 cursor-pointer transition duration-500"
                :class="item.isActive?.() ? 'bg-gray-700 shadow-lg' : 'hover:bg-gray-700'">
                {{ item.icon }}
            </Badge>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { Badge } from '@/components/ui/badge'

const editor = inject('editor')

const position = ref({
    show: false,
    top: 0,
    left: 0
})

const bubbleItems = computed(() => editor.value.getBubbleMenuItems())

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