<script setup>
import { Plus, Trash } from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'

const props = defineProps({
    node: { type: Object, required: true },
    view: { type: Object, required: true },
    getPos: { type: Function, required: true },
    updateAttrs: { type: Function, required: true },
    editor: { type: Object }
})

const attrs = ref({ ...props.node.attrs })

const gridStyle = computed(() => {
    const style = {
        gridTemplateColumns: `repeat(${attrs.value.columns}, 1fr)`,
        alignItems: attrs.value.alignItems,
        justifyItems: attrs.value.justifyItems
    }
    
    // Handle rows: 'auto' or specific number
    if (attrs.value.rows === 'auto') {
        style.gridTemplateRows = 'auto'
    } else {
        style.gridTemplateRows = `repeat(${attrs.value.rows}, auto)`
    }
    
    // Handle gaps - use specific column/row gaps if set, otherwise use general gap
    if (attrs.value.columnGap !== null || attrs.value.rowGap !== null) {
        if (attrs.value.columnGap !== null) {
            style.columnGap = `${attrs.value.columnGap}px`
        }
        if (attrs.value.rowGap !== null) {
            style.rowGap = `${attrs.value.rowGap}px`
        }
    } else {
        style.gap = `${attrs.value.gap}px`
    }
    
    return style
})

const updateColumns = (value) => {
    attrs.value.columns = Math.max(1, Math.min(12, parseInt(value) || 1))
    props.updateAttrs(attrs.value)
}

const updateRows = (value) => {
    const parsed = value === 'auto' ? 'auto' : parseInt(value) || 'auto'
    attrs.value.rows = parsed
    props.updateAttrs(attrs.value)
}

const updateGap = (value) => {
    attrs.value.gap = Math.max(0, Math.min(100, parseInt(value) || 0))
    props.updateAttrs(attrs.value)
}

const updateAlignItems = (value) => {
    attrs.value.alignItems = value
    props.updateAttrs(attrs.value)
}

const updateJustifyItems = (value) => {
    attrs.value.justifyItems = value
    props.updateAttrs(attrs.value)
}

const deleteNode = () => {
    const pos = props.getPos()
    const tr = props.view.state.tr.delete(pos, pos + props.node.nodeSize)
    props.view.dispatch(tr)
}

// Watch for external changes
watch(() => props.node.attrs, (newAttrs) => {
    attrs.value = { ...newAttrs }
}, { deep: true })
</script>

<template>
    <div class="grid my-4 relative group" :style="gridStyle">
        <!-- Hover outline for visibility -->
        <div class="absolute inset-0 border-2 border-dashed border-blue-300 
                    opacity-0 group-hover:opacity-100 pointer-events-none 
                    rounded transition-opacity z-0">
        </div>
        
        <!-- Hover controls -->
        <div class="absolute -top-14 right-0 opacity-0 group-hover:opacity-100 
                    flex gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-lg
                    transition-opacity z-10 items-center text-sm">
            <div class="flex items-center gap-1">
                <label class="text-xs text-gray-600 font-medium">Cols:</label>
                <input 
                    type="number" 
                    :value="attrs.columns" 
                    @input="updateColumns($event.target.value)"
                    min="1"
                    max="12"
                    class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div class="flex items-center gap-1">
                <label class="text-xs text-gray-600 font-medium">Gap:</label>
                <input 
                    type="number" 
                    :value="attrs.gap" 
                    @input="updateGap($event.target.value)"
                    min="0"
                    max="100"
                    class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-xs text-gray-500">px</span>
            </div>
            
            <div class="flex items-center gap-1">
                <label class="text-xs text-gray-600 font-medium">Align:</label>
                <select 
                    :value="attrs.alignItems" 
                    @change="updateAlignItems($event.target.value)"
                    class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="stretch">Stretch</option>
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                </select>
            </div>
            
            <div class="flex items-center gap-1">
                <label class="text-xs text-gray-600 font-medium">Justify:</label>
                <select 
                    :value="attrs.justifyItems" 
                    @change="updateJustifyItems($event.target.value)"
                    class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="stretch">Stretch</option>
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                </select>
            </div>

            <button 
                @click="add"
                class="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete grid"
            >
                <Plus />
            </button>
            
            <button 
                @click="deleteNode"
                class="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete grid"
            >
                <Trash />
            </button>
        </div>
        
        <!-- Content area - use "contents" to avoid extra wrapper -->
        <div prose-content class="contents"></div>
    </div>
</template>
