<template>
    <div class="bg-gray-900 rounded shadow-lg p-3 w-64">
        <!-- Preset Colors Grid -->
        <div class="grid grid-cols-8 gap-1 mb-3">
            <button v-for="color in presetColors" :key="color" type="button" @click="selectColor(color)"
                :style="{ backgroundColor: color }" :class="[
                    'w-6 h-6 rounded cursor-pointer border-2 transition duration-500',
                    selectedColor === color ? 'border-blue-600 scale-[1.1]' : 'border-gray-700 hover:border-gray-500'
                ]"></button>
        </div>

        <!-- Custom Color Input -->
        <div class="flex items-center gap-2 border-t border-gray-700 pt-3">
            <input v-model="customColor" type="color" @input="selectColor(customColor)"
                class="w-10 h-10 rounded cursor-pointer bg-transparent border-2 border-gray-700 hover:border-gray-500 transition duration-500" />
            <input v-model="customColor" type="text" placeholder="#000000" @input="selectColor(customColor)"
                @keyup.enter="selectColor(customColor)"
                class="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-600 transition duration-500" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: '#000000'
    }
})

const emit = defineEmits(['update:modelValue', 'select'])

const presetColors = [
    '#000000', '#333333', '#666666', '#999999',
    '#CCCCCC', '#FFFFFF', '#FF0000', '#FF6B00',
    '#FFD700', '#00FF00', '#00FFFF', '#0000FF',
    '#8B00FF', '#FF00FF', '#FF1493', '#8B4513',
    '#2E8B57', '#4682B4', '#6A5ACD', '#DC143C',
    '#FF69B4', '#FFA500', '#32CD32', '#1E90FF',
]

const selectedColor = ref(props.modelValue)
const customColor = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
    selectedColor.value = newVal
    customColor.value = newVal
})

const selectColor = (color) => {
    selectedColor.value = color
    customColor.value = color
    emit('update:modelValue', color)
    emit('select', color)
}
</script>