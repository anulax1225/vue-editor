<template>
    <div class="flex gap-2 items-center">
        <Badge v-for="(item, index) in flattenedItems" :key="`${item.name}-${index}`" @click="handleClick(item)" :class="item.isActive() ? 'shadow-lg bg-red-500' : '' ">
            {{ item.title }}
        </Badge>
    </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { Badge } from '@/components/ui/badge'
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

const props = defineProps({
    editor: {
        type: Object,
        required: true,
    },
})

const editor = reactive(props.editor);

const flattenedItems = ref(editor.getMenuItems());

defineExpose({
    forceRerender() {
        instance.proxy.$forceUpdate()
    }
})

const handleClick = (item) => {
    if (item.isDisabled && item.isDisabled()) {
        return
    }
    if (item.action) {
        console.log("Clicked", item.title)
        item.action()
    }
    editor.focus()
}
</script>