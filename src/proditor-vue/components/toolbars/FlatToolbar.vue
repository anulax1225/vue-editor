<template v-if="editor">
    <div>
        <div class="flex gap-x-1 gap-y-0.5 flex-wrap h-fit">
            <Badge 
            variant="outline" 
            v-for="(item, index) in flattenedItems" 
            :key="`${item.name}-${index}`" 
            @click="handleClick(item)" 
            class="pb-1 h-fit"
            :class="item.isActive?.() ? 'shadow-lg bg-red-500' : '' "
            >
                {{ item.icon }}
            </Badge>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue'
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