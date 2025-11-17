<template v-if="editor">
    <Tabs :default-value="'general'" class="w-full">
        <TabsList class="h-auto p-1">
            <TabsTrigger v-for="group in Object.keys(groupedItems).toSorted((a,b) => a === 'general' ? -1 : (b === 'general' ? 1 : 0))" :key="group" :value="group" class="text-xs px-3 py-1">
                {{ group }}
            </TabsTrigger>
        </TabsList>
        <TabsContent v-for="group in Object.keys(groupedItems)" :key="group" :value="group" class="mt-2">
            <div class="flex gap-2 items-center flex-wrap">
                <Badge v-for="(item, index) in groupedItems[group]" :key="`${item.name}-${index}`" 
                    @click="handleClick(item)" 
                    :class="[item.isActive() ? 'bg-red-500 shadow-lg' : '', 'cursor-pointer']">
                    {{ item.title }}
                </Badge>
            </div>
        </TabsContent>
    </Tabs>
</template>

<script setup>
import { computed, inject, getCurrentInstance } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const instance = getCurrentInstance()
const editor = inject('editor')


const groupedItems = computed(() => {
    const items = editor.value.getMenuItems()
    return items.reduce((acc, item) => {
        const group = item.group || 'general'
        if (!acc[group]) acc[group] = []
        acc[group].push(item)
        //console.log(item.title, item.isActive?.())
        return acc
    }, {});
})

const handleClick = (item) => {
    if (item.isDisabled?.()) return
    item.action?.()
    editor.value.focus()
}

defineExpose({ forceRerender: () => { instance.proxy.$forceUpdate(); console.log("Renderer") } })
</script>