<template>
  <div 
    :data-callout="true"
    :data-variant="node.attrs.variant"
    :class="[
      'rounded-lg border-l-4 p-4 my-4',
      variantClasses[node.attrs.variant]
    ]"
  >
    <div class="w-full flex items-center gap-3 mb-2">
      <component :is="variantIcons[node.attrs.variant]" />
      <select 
        v-model="selectedVariant"
        @change="changeVariant"
        class="text-sm font-medium bg-background border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
      >
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="success">Success</option>
      </select>
    </div>
    <div prose-content class="prose prose-sm max-w-none"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Info, AlertTriangle, Bug, Check  } from 'lucide-vue-next'

const props = defineProps({
  node: { type: Object, required: true },
  view: { type: Object, required: true },
  getPos: { type: Function, required: true },
  updateAttrs: { type: Function, required: true },
})

const selectedVariant = ref(props.node.attrs.variant)
const attrs = ref(props.node.attrs)
const variantIcons = {
  info: Info,
  warning: AlertTriangle,
  error: Bug,
  success: Check
}

const variantClasses = {
  info: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
  warning: 'bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
  error: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-950 dark:text-red-100',
  success: 'bg-green-50 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-100'
}

watch(() => props.node.attrs.variant, (newVal) => {
  selectedVariant.value = newVal
})

const changeVariant = () => {
    attrs.value.variant = selectedVariant.value;
    props.updateAttrs(attrs)
}
</script>