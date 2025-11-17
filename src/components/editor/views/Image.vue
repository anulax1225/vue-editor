<template>
    <div class="my-1 w-fit relative" :class="{
        'mr-auto': attrs.align === 'left',
        'mx-auto': attrs.align === 'center',
        'ml-auto': attrs.align === 'right',
        'ring-2 ring-blue-500 ring-offset-2 rounded': selected
    }" @click="selected = true">
        
        <!-- Placeholder while loading -->
        <div v-if="isLoading" 
            class="inline-block relative max-w-full animate-pulse bg-gray-200 rounded"
            :style="{ 
                width: attrs.width ? `${attrs.width}px` : '400px',
                height: attrs.width ? `${attrs.width * 0.75}px` : '300px'
            }"
        >
            <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>

        <!-- Actual image -->
        <div v-show="!isLoading" class="inline-block relative max-w-full">
            <img 
                :src="attrs.src" 
                :alt="attrs.alt" 
                :title="attrs.title"
                :style="{ width: attrs.width ? `${attrs.width}px` : 'auto' }"
                @load="onImageLoad"
                @error="onImageError"
                class="max-w-full h-auto block rounded"
            />

            <!-- Resize handles -->
            <div 
                v-if="selected && !isResizing" 
                class="absolute top-1/2 -translate-y-1/2 left-[-4px] w-2 h-10 bg-blue-500 rounded cursor-ew-resize opacity-80 hover:opacity-100 transition-opacity"
                @mousedown="startResize('left', $event)"
            ></div>
            <div 
                v-if="selected && !isResizing" 
                class="absolute top-1/2 -translate-y-1/2 right-[-4px] w-2 h-10 bg-blue-500 rounded cursor-ew-resize opacity-80 hover:opacity-100 transition-opacity"
                @mousedown="startResize('right', $event)"
            ></div>
        </div>

        <!-- Controls toolbar -->
        <div 
            v-if="selected && !isLoading" 
            class="absolute top-0 flex gap-2 items-center justify-center mt-2 px-2 py-2 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
            <button 
                v-for="alignment in ['left', 'center', 'right']"
                :key="alignment"
                @click="setAlign(alignment)"
                :class="{
                    'bg-blue-500 text-white border-blue-500': attrs.align === alignment,
                    'bg-white hover:bg-gray-50': attrs.align !== alignment
                }"
                class="px-3 py-1.5 border border-gray-200 rounded cursor-pointer text-sm transition-all"
            >
                {{ alignmentIcon(alignment) }}
            </button>

            <button 
                @click="deleteImage"
                class="px-3 py-1.5 border border-gray-200 bg-white hover:bg-red-50 hover:border-red-400 rounded cursor-pointer text-sm transition-all"
            >
                🗑️
            </button>
        </div>

        <!-- Error message -->
        <div v-if="hasError" class="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            Failed to load image
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    node: Object,
    view: Object,
    getPos: Function,
    updateAttrs: Function,
})

const attrs = computed(() => props.node.attrs)
const selected = ref(false)
const localAlt = ref(attrs.value.alt || '')
const isResizing = ref(false)
const originalWidth = ref(null)
const isLoading = ref(true)
const hasError = ref(false)

const alignmentIcon = (align) => {
    const icons = {
        left: '⬅️',
        center: '↔️',
        right: '➡️',
    }
    return icons[align]
}

const setAlign = (align) => {
    props.updateAttrs({ align })
}

const updateAlt = () => {
    props.updateAttrs({ alt: localAlt.value })
}

const deleteImage = () => {
    const pos = props.getPos()
    const tr = props.view.state.tr.delete(pos, pos + props.node.nodeSize)
    props.view.dispatch(tr)
}

const onImageLoad = (event) => {
    isLoading.value = false
    hasError.value = false
    
    if (!attrs.value.width) {
        originalWidth.value = event.target.naturalWidth
    }
}

const onImageError = () => {
    isLoading.value = false
    hasError.value = true
}

// Resize functionality
let startX = 0
let startWidth = 0
let resizeDirection = 'right'

const startResize = (direction, event) => {
    event.preventDefault()
    resizeDirection = direction
    startX = event.clientX
    startWidth = attrs.value.width || originalWidth.value
    isResizing.value = true

    document.addEventListener('mousemove', onResize)
    document.addEventListener('mouseup', stopResize)
}

const onResize = (event) => {
    const diff = resizeDirection === 'right'
        ? event.clientX - startX
        : startX - event.clientX

    const newWidth = Math.max(100, startWidth + diff)
    props.updateAttrs({ width: newWidth })
}

const stopResize = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', stopResize)
}

// Close controls when clicking outside
const handleClickOutside = (event) => {
    const nodeDOM = props.view.nodeDOM(props.getPos())
    if (nodeDOM && !nodeDOM.contains(event.target)) {
        selected.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', stopResize)
})
</script>