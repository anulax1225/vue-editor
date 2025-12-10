<template>
    <div class="relative" ref="containerRef">
        <div v-if="!props.isBubble" class="flex items-center gap-1 rounded overflow-hidden bg-gray-900 px-1">
            <!-- Apply Color Badge -->
            <Badge variant="ghost" @click="editor.chain().insertTable().run()" :class="[
                'pb-1 cursor-pointer transition duration-500 border-none',
                menuItem.isActive()
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-700'
            ]">
                <Table class="w-4 h-4" />
            </Badge>

            <Badge variant="outline" @click="toggleMenu" :class="[
                'pb-1 cursor-pointer transition duration-500 border-none',
                showMenu
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-700'
            ]">
                <ChevronDown :class="['w-3 h-3 transition duration-500', showMenu ? 'rotate-180' : '']" />
            </Badge>
        </div>
        <div v-else @click="toggleMenu" class="grid grid-cols-10 items-center">
            <div class="col-span-2">
                <Table class="w-3 h-3" />
            </div>
            <p class="col-span-7 text-xs">Table operations</p>
            <ChevronDown
                :class="['w-3 h-3 transition duration-500', showMenu ? 'rotate-90' : 'rotate-[270deg]']" />
        </div>

        <!-- Menu Popover -->
        <div v-if="showMenu" :class="props.isBubble ? 'bottom-0 left-full ml-2' : 'top-full left-0 mt-2'"
            class="absolute z-50 bg-gray-900 rounded-lg shadow-lg overflow-hidden min-w-[180px]">
            <div v-if="props.isBubble" class="border-b border-gray-700">
                <button @click="editor.chain().insertTable().run()"
                    :class="buttonClasses">
                    <Plus class="w-4 h-4" />
                    <span>Create table</span>
                </button>
            </div>
            <!-- Row Operations -->
            <div class="border-b border-gray-700">
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">Rows</div>
                <button @click="editor.chain().addRowBefore().run()" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <ArrowUp class="w-4 h-4" />
                    <span>Add Row Above</span>
                </button>
                <button @click="editor.chain().addRowAfter().run()" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <ArrowDown class="w-4 h-4" />
                    <span>Add Row Below</span>
                </button>
                <button @click="editor.chain().deleteRow().run()" :disabled="!menuItem.isActive()"
                    :class="[...buttonClasses, 'text-red-400 hover:text-red-300']">
                    <Trash2 class="w-4 h-4" />
                    <span>Delete Row</span>
                </button>
            </div>

            <!-- Column Operations -->
            <div class="border-b border-gray-700">
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">Columns</div>
                <button @click="editor.chain().addColumnBefore().run()" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <ArrowLeft class="w-4 h-4" />
                    <span>Add Column Left</span>
                </button>
                <button @click="editor.chain().addColumnAfter().run()" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <ArrowRight class="w-4 h-4" />
                    <span>Add Column Right</span>
                </button>
                <button @click="editor.chain().deleteColumn().run()" :disabled="!menuItem.isActive()"
                    :class="[...buttonClasses, 'text-red-400 hover:text-red-300']">
                    <Trash2 class="w-4 h-4" />
                    <span>Delete Column</span>
                </button>
            </div>

            <!-- Cell Operations -->
            <div>
                <div class="px-2 py-1 text-xs text-gray-400 font-medium">Cells</div>
                <button @click="editor.chain().mergeCells().run()" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <Combine class="w-4 h-4" />
                    <span>Merge Cells</span>
                </button>
                <button @click="editor.chain().splitCell().run()" :disabled="!menuItem.isActive()"
                    :class="buttonClasses">
                    <Split class="w-4 h-4" />
                    <span>Split Cell</span>
                </button>
                <button @click="editor.chain().deleteTable().run()" :disabled="!menuItem.isActive()"
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
    Trash2, Combine, Split, Trash, Pencil, Plus,
} from 'lucide-vue-next'

const props = defineProps({
    menuItem: { type: Object, required: true },
    editor: { type: Object, required: true },
    isBubble: { type: Boolean, default: false },
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