<template>
  <li 
    :data-type="'task-item'" 
    :data-checked="node.attrs.checked"
    class="flex items-start gap-2 list-none"
  >
    <input 
      type="checkbox" 
      :checked="node.attrs.checked"
      @change="toggleChecked"
      class="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
    />
    <div 
      ref="contentDOM" 
      :class="[
        'flex-1 min-w-0',
        node.attrs.checked && 'line-through opacity-60'
      ]"
    ></div>
  </li>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  view: { type: Object, required: true },
  getPos: { type: Function, required: true },
  decorations: { type: Array, default: () => [] }
})

const contentDOM = ref(null)

const toggleChecked = () => {
  const pos = props.getPos()
  const tr = props.view.state.tr.setNodeMarkup(pos, null, {
    ...props.node.attrs,
    checked: !props.node.attrs.checked
  })
  props.view.dispatch(tr)
}

defineExpose({
  contentDOM
})
</script>
