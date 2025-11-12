<template>
    <div
        class="w-fit flex items-center justify-center gap-4 p-4 my-4 bg-gradient-to-b from-white to-gray-200 rounded-lg border-2 border-gray-300">
        <div class="flex items-center gap-x-2">
            {{ attrs.count }}
            {{ attrs.count === 1 ? 'click' : 'clicks' }}
        </div>
        <button @click="incrementCount"
            class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95">
            {{ attrs.label }}
        </button>

        <button @click="resetCount"
            class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors shadow-md"
            title="Reset counter">
            Reset
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    node: {
        type: Object,
        required: true,
    },
    view: {
        type: Object,
        required: true,
    },
    getPos: {
        type: Function,
        required: true,
    },
    updateAttrs: {
        type: Function,
        required: true,
    },
})

const attrs = ref(props.node.attrs)

const incrementCount = () => {
    attrs.value.count += 1;
    props.updateAttrs(attrs.value);
}

const resetCount = () => {
    attrs.value.count = 0;
    props.updateAttrs(attrs.value);
}
</script>