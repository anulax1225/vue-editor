<template>
    <details :open="attrs.open" class="rounded-lg border border-border bg-card my-4 overflow-hidden"
        @toggle.prevent>
        <summary @click.prevent="toggleOpen"
            class="flex items-center gap-2 px-4 py-3 cursor-pointer select-none font-medium hover:bg-accent/50 transition-colors">
            <span class="text-muted-foreground text-sm shrink-0">
                {{ attrs.open ? '▾' : '▸' }}
            </span>
            <input v-if="editingSummary" v-model="summaryText" @blur="saveSummary" @keydown.enter.prevent="saveSummary"
                @keydown.esc.prevent="cancelEdit"
                class="flex-1 bg-transparent border-b border-primary outline-none px-1" ref="summaryInput" />
            <span v-else @dblclick="startEditingSummary" class="flex-1">
                {{ attrs.summary }}
            </span>
        </summary>
        <div v-show="node.attrs.open" class="px-4 py-3 border-t border-border">
            <div prose-content></div>
        </div>
    </details>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    node: { type: Object, required: true },
    view: { type: Object, required: true },
    getPos: { type: Function, required: true },
    updateAttrs: { type: Function, required: true },
})

const summaryInput = ref(null)
const editingSummary = ref(false)
const summaryText = ref(props.node.attrs.summary)
const attrs = ref(props.node.attrs)

watch(() => props.node.attrs.summary, (newVal) => {
    summaryText.value = newVal
})

const toggleOpen = () => {
    attrs.value.open = !attrs.value.open;
        console.log(attrs.value.open);
    props.updateAttrs(attrs.value);
}

const startEditingSummary = () => {
    editingSummary.value = true
    nextTick(() => {
        summaryInput.value?.focus()
        summaryInput.value?.select()
    })
}

const saveSummary = () => {
    props.updateAttrs({ summary: summaryText.value })
    editingSummary.value = false
}

const cancelEdit = () => {
    summaryText.value = props.node.attrs.summary
    editingSummary.value = false
}
</script>
