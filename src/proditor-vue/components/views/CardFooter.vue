<template>
  <div 
    class="card-footer flex"
    :class="[
      borderClass,
      textAlignClass,
      justifyClass
    ]"
    :style="footerStyle"
  >
    <div prose-content class="w-full"></div>
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
  attrs.value.borderTop ? 'border-t border-gray-200' : ''
)

const textAlignClass = computed(() => `text-${attrs.value.textAlign}`)

const justifyClass = computed(() => {
  const justifyMap = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around'
  }
  return justifyMap[attrs.value.justify] || 'justify-start'
})

const footerStyle = computed(() => ({
  backgroundColor: attrs.value.backgroundColor,
  padding: attrs.value.padding
}))

watch(() => props.node.attrs, (newAttrs) => {
  attrs.value = newAttrs
}, { deep: true })
</script>
