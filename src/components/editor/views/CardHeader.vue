<template>
  <div 
    class="card-header"
    :class="[
      borderClass,
      textAlignClass
    ]"
    :style="headerStyle"
  >
    <div prose-content class="prose prose-sm max-w-none"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  view: { type: Object, required: true },
  getPos: { type: Function, required: true },
  updateAttrs: { type: Function, required: true }
})

const attrs = ref(props.node.attrs)

const borderClass = computed(() => 
  attrs.value.borderBottom ? 'border-b border-gray-200' : ''
)

const textAlignClass = computed(() => `text-${attrs.value.textAlign}`)

const headerStyle = computed(() => ({
  backgroundColor: attrs.value.backgroundColor,
  padding: attrs.value.padding
}))

watch(() => props.node.attrs, (newAttrs) => {
  attrs.value = newAttrs
}, { deep: true })
</script>
