<template>
    <div class="relative inline-flex" ref="containerRef">
        <!-- Badge Group -->
        <div class="flex items-center rounded overflow-hidden">
            <!-- Apply Current Heading Badge -->
            <Badge variant="outline" @click="handleApply" :class="[
                'pb-1 cursor-pointer transition duration-500 rounded-r-none border-r-0',
                menuItem.isActive()
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-700'
            ]">
                <component :is="currentIcon" class="w-4 h-4" />
            </Badge>
            <!-- Dropdown Toggle Badge -->
            <Badge variant="outline" @click="toggleDropdown" :class="[
                'pb-1 cursor-pointer transition duration-500 rounded-l-none',
                showDropdown
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-700'
            ]">
                <ChevronDown :class="['w-3 h-3 transition duration-500', showDropdown ? 'rotate-180' : '']" />
            </Badge>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="showDropdown"
            class="absolute top-full left-0 mt-2 z-50 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <button v-for="level in levels" :key="level.value" @click="selectLevel(level.value)" :class="[
                'w-full px-2 py-1 text-left flex items-center gap-2 transition duration-200 text-sm',
                selectedLevel === level.value
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700 text-gray-200'
            ]">
                <component :is="level.icon" class="w-4 h-4" />
                <span>{{ level.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Heading1, Heading2, Heading3, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
    menuItem: { type: Object, required: true }
})

const showDropdown = ref(false)
const containerRef = ref(null)

const levels = [
    { value: 1, label: 'Heading 1', icon: Heading1 },
    { value: 2, label: 'Heading 2', icon: Heading2 },
    { value: 3, label: 'Heading 3', icon: Heading3 }
]

// Get current level from editor state
const selectedLevel = computed(() => {
    console.log("selecting level")
    if (props.menuItem._editor) {
        const { $from } = props.menuItem._editor.state.selection
        if ($from.parent.type.name === 'heading') {
            return $from.parent.attrs.level
        }
    }
    return 1
})

const currentIcon = computed(() => {
    const level = levels.find(l => l.value === selectedLevel.value)
    return level ? level.icon : Heading1
})

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const handleApply = () => {
    if (props.menuItem.action) {
        props.menuItem.action()
    }
}

const selectLevel = (level) => {
    if (props.menuItem.onLevelSelect) {
        props.menuItem.onLevelSelect(level)
    }
    showDropdown.value = false
}

const handleClickOutside = (event) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>