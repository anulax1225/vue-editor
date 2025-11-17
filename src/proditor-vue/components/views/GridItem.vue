<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    node: { type: Object, required: true },
    view: { type: Object, required: true },
    getPos: { type: Function, required: true },
    updateAttrs: { type: Function, required: true },
    editor: { type: Object }
})

const attrs = ref({ ...props.node.attrs })

const gridItemStyle = computed(() => {
    const style = {}
    
    // Column positioning
    if (attrs.value.columnStart !== null) {
        style.gridColumnStart = attrs.value.columnStart
    }
    
    if (attrs.value.columnSpan > 1) {
        style.gridColumnEnd = `span ${attrs.value.columnSpan}`
    } else if (attrs.value.columnEnd !== null) {
        style.gridColumnEnd = attrs.value.columnEnd
    }
    
    // Row positioning
    if (attrs.value.rowStart !== null) {
        style.gridRowStart = attrs.value.rowStart
    }
    
    if (attrs.value.rowSpan > 1) {
        style.gridRowEnd = `span ${attrs.value.rowSpan}`
    } else if (attrs.value.rowEnd !== null) {
        style.gridRowEnd = attrs.value.rowEnd
    }
    
    // Alignment overrides
    if (attrs.value.alignSelf !== null) {
        style.alignSelf = attrs.value.alignSelf
    }
    
    if (attrs.value.justifySelf !== null) {
        style.justifySelf = attrs.value.justifySelf
    }
    
    // Order override
    if (attrs.value.order !== null) {
        style.order = attrs.value.order
    }
    
    return style
})

const positionLabel = computed(() => {
    const col = attrs.value.columnStart !== null ? attrs.value.columnStart : '?'
    const row = attrs.value.rowStart !== null ? attrs.value.rowStart : '?'
    const colSpan = attrs.value.columnSpan > 1 ? ` (×${attrs.value.columnSpan})` : ''
    const rowSpan = attrs.value.rowSpan > 1 ? ` (×${attrs.value.rowSpan})` : ''
    return `C${col}${colSpan} R${row}${rowSpan}`
})

const updateColumnSpan = (value) => {
    attrs.value.columnSpan = Math.max(1, Math.min(12, parseInt(value) || 1))
    props.updateAttrs(attrs.value)
}

const updateRowSpan = (value) => {
    attrs.value.rowSpan = Math.max(1, Math.min(12, parseInt(value) || 1))
    props.updateAttrs(attrs.value)
}

// Watch for external changes
watch(() => props.node.attrs, (newAttrs) => {
    attrs.value = { ...newAttrs }
}, { deep: true })
</script>

<template>
    <div 
        class="min-h-[80px] p-3 border border-gray-200 rounded group relative
               hover:bg-gray-50 transition-colors"
        :style="gridItemStyle"
    >   
        <!-- Content area -->
        <div prose-content class="prose prose-sm max-w-none"></div>
    </div>
</template>
