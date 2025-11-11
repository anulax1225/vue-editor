<template v-if="editor">
    <div class="flex gap-2 items-center">
        <Badge v-for="(item, index) in flattenedItems" :key="`${item.name}-${index}`" @click="handleClick(item)" :class="item.isActive() ? 'shadow-lg bg-red-500' : '' ">
            {{ item.icon }}
        </Badge>
    </div>

</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { Badge } from '@/components/ui/badge'
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

const editor = inject('editor');

const flattenedItems = computed(() => editor.value.getMenuItems());

defineExpose({
    forceRerender() {
        instance.proxy.$forceUpdate()
    }
})

const handleClick = (item) => {
    if (item.isDisabled && item.isDisabled()) return
    if (item.action) item.action()
    editor.value.focus()
}
</script>