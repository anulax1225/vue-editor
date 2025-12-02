<template>
    <div class="relative inline-flex" ref="containerRef">
        <Badge variant="outline" @click="toggleMenu" :class="[
            'pb-1 cursor-pointer transition duration-500',
            showMenu ? 'bg-gray-800 shadow-lg' : 'hover:bg-gray-700'
        ]">
            <Table class="w-4 h-4" />
            <ChevronDown :class="['w-3 h-3 ml-1 transition duration-500', showMenu ? 'rotate-180' : '']" />
        </Badge>

        <!-- Menu Popover -->
        <div v-if="showMenu"
            class="absolute top-full left-0 mt-2 z-50 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden min-w-[180px]">
            <!-- Row Operations -->
            <div class="border-b border-gray-700">
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">Rows</div>
                <button @click="executeCommand('addRowBefore')" :disabled="!menuItem.isActive()" :class="buttonClasses">
                    <ArrowUp class="w-4 h-4" />
                    <span>Add Row Above</span>
                </button>
                <button @click="executeCommand('addRowAfter')" :disabled="!menuItem.isActive()" :class="buttonClasses">
                    <ArrowDown class="w-4 h-4" />
                    <span>Add Row Below</span>
                </button>
                <button @click="executeCommand('deleteRow')" :disabled="!menuItem.isActive()"
                    :class="[...buttonClasses, 'text-red-400 hover:text-red-300']">
                    <Trash2 class="w-4 h-4" />
                    <span>Delete Row</span>
                </button>
            </div>

            <!-- Column Operations -->
            <div class="border-b border-gray-700">
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">Columns</div>
                <button @click="executeCommand('addColumnBefore')" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <ArrowLeft class="w-4 h-4" />
                    <span>Add Column Left</span>
                </button>
                <button @click="executeCommand('addColumnAfter')" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <ArrowRight class="w-4 h-4" />
                    <span>Add Column Right</span>
                </button>
                <button @click="executeCommand('deleteColumn')" :disabled="!menuItem.isActive()"
                    :class="[...buttonClasses, 'text-red-400 hover:text-red-300']">
                    <Trash2 class="w-4 h-4" />
                    <span>Delete Column</span>
                </button>
            </div>

            <!-- Cell Operations -->
            <div>
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">Cells</div>
                <button @click="executeCommand('mergeCells')" :disabled="!menuItem.isActive()" :class="buttonClasses">
                    <Combine class="w-4 h-4" />
                    <span>Merge Cells</span>
                </button>
                <button @click="executeCommand('splitCell')" :disabled="!menuItem.isActive()" :class="buttonClasses">
                    <Split class="w-4 h-4" />
                    <span>Split Cell</span>
                </button>
                <button @click="executeCommand('deleteTable')" :disabled="!menuItem.isActive()"
                    :class="[...buttonClasses, 'text-red-400 hover:text-red-300']">
                    <Trash class="w-4 h-4" />
                    <span>Delete Table</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
    Table, ChevronDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    Trash2, Combine, Split, Trash
} from 'lucide-vue-next'

const props = defineProps({
    menuItem: { type: Object, required: true }
})

const showMenu = ref(false)
const containerRef = ref(null)

const buttonClasses = computed(() => [
    'w-full px-2 py-1.5 text-left flex items-center gap-2 transition duration-200 text-sm',
    'hover:bg-gray-700 text-gray-200',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent'
])

const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const executeCommand = (command) => {
    if (props.menuItem.commands && props.menuItem.commands[command]) {
        props.menuItem.commands[command]()
        showMenu.value = false
    }
}

const handleClickOutside = (event) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
        showMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>