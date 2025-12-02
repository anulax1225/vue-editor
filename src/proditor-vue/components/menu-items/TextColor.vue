<template>
    <div class="relative inline-flex" ref="containerRef">
        <!-- Badge Group -->
        <div class="flex items-center rounded overflow-hidden">
            <!-- Apply Color Badge -->
            <Badge variant="outline" @click="handleToggle" :class="[
                'pb-1 cursor-pointer transition duration-500 rounded-r-none border-r-0',
                menuItem.isActive()
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-700'
            ]">
                <Palette class="w-4 h-4" :style="'color:' + selectedColor"/>
            </Badge>

            <!-- Color Picker Toggle Badge -->
            <Badge variant="outline" @click="togglePicker" :class="[
                'pb-1 cursor-pointer transition duration-500 rounded-l-none',
                showPicker
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-700'
            ]">
                <ChevronDown :class="['w-3 h-3 transition duration-500', showPicker ? 'rotate-180' : '']" />
            </Badge>
        </div>

        <!-- Color Picker Popover -->
        <div v-if="showPicker" class="absolute top-full left-0 mt-2 z-50">
            <ColorPicker v-model="selectedColor" @select="handleColorSelect" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Badge } from '@/components/ui/badge'
import ColorPicker from './ColorPicker.vue'
import { Palette, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
    menuItem: {
        type: Object,
        required: true
    }
})

const showPicker = ref(false)
const selectedColor = ref(props.menuItem.currentColor || '#000000')
const containerRef = ref(null)

const togglePicker = () => {
    showPicker.value = !showPicker.value
}

const handleToggle = () => {
    if (props.menuItem.action) {
        props.menuItem.action()
    }
}

const handleColorSelect = (color) => {
    selectedColor.value = color
    if (props.menuItem.onColorSelect) {
        props.menuItem.onColorSelect(color)
    }
    showPicker.value = false
}

// Close picker when clicking outside
const handleClickOutside = (event) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
        showPicker.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>