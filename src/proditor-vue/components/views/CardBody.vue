<template>
  <div 
    class="card-body"
    :style="bodyStyle"
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

const bodyStyle = computed(() => ({
  padding: attrs.value.padding,
  overflow: attrs.value.overflow
}))

watch(() => props.node.attrs, (newAttrs) => {
  attrs.value = newAttrs
}, { deep: true })
</script>
