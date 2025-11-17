<template>
  <div 
    class="card-wrapper my-4 relative group"
    :class="alignClass"
  >
    <!-- Hover Controls -->
    <div class="absolute -top-10 left-0 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/95 backdrop-blur-sm border border-border rounded-md p-2 shadow-lg">
      <!-- Variant Selector -->
      <select 
        v-model="selectedVariant"
        @change="updateVariant"
        class="text-xs bg-background border border-input rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        <option value="default">Default</option>
        <option value="outlined">Outlined</option>
        <option value="elevated">Elevated</option>
        <option value="flat">Flat</option>
      </select>

      <!-- Shadow Selector -->
      <select 
        v-model="localShadow"
        @change="updateShadow"
        class="text-xs bg-background border border-input rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        <option value="none">No Shadow</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      <!-- Border Radius Buttons -->
      <div class="flex gap-1 border-l pl-2">
        <button 
          v-for="radius in ['none', 'small', 'medium', 'large', 'rounded']"
          :key="radius"
          @click="updateBorderRadius(radius)"
          :class="[
            'text-xs px-2 py-1 rounded transition-colors',
            attrs.borderRadius === radius 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-accent'
          ]"
        >
          {{ radius.charAt(0).toUpperCase() }}
        </button>
      </div>

      <!-- Max Width Selector -->
      <select 
        v-model="localMaxWidth"
        @change="updateMaxWidth"
        class="text-xs bg-background border border-input rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        <option value="none">Full Width</option>
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
        <option value="xl">XL</option>
        <option value="2xl">2XL</option>
      </select>

      <!-- Clickable Toggle -->
      <label class="flex items-center gap-1 text-xs cursor-pointer border-l pl-2">
        <input 
          type="checkbox" 
          v-model="localClickable"
          @change="updateClickable"
          class="rounded"
        />
        <span>Clickable</span>
      </label>
    </div>

    <!-- Card Container -->
    <div 
      :data-card="true"
      :data-variant="node.attrs.variant"
      :class="[
        'card overflow-hidden transition-all',
        variantClass,
        shadowClasses[node.attrs.shadow],
        borderRadiusClasses[node.attrs.borderRadius],
        maxWidthClasses[node.attrs.maxWidth],
        { 'cursor-pointer hover:scale-[1.02]': node.attrs.clickable }
      ]"
      :style="cardStyle"
    >
      <!-- Content sections (header, body, footer) render here -->
      <div prose-content></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  view: { type: Object, required: true },
  getPos: { type: Function, required: true },
  updateAttrs: { type: Function, required: true },
  editor: { type: Object }
})

// Local state
const attrs = ref(props.node.attrs)
const selectedVariant = ref(props.node.attrs.variant)
const localShadow = ref(props.node.attrs.shadow)
const localMaxWidth = ref(props.node.attrs.maxWidth)
const localClickable = ref(props.node.attrs.clickable)

// Variant styling
const variantClass = computed(() => {
    const variantClasses = {
        default: 'bg-white border border-gray-200',
        outlined: 'bg-transparent border-2 border-gray-300',
        elevated: 'bg-white border-0',
        flat: 'bg-gray-50 border-0'
    }
    console.log(variantClasses[attrs.value.variant]);
    return variantClasses[attrs.value.variant];
})

// Shadow styling
const shadowClasses = {
  none: '',
  small: 'shadow-sm',
  medium: 'shadow-md',
  large: 'shadow-lg'
}

// Border radius styling
const borderRadiusClasses = {
  none: 'rounded-none',
  small: 'rounded-sm',
  medium: 'rounded-lg',
  large: 'rounded-xl',
  rounded: 'rounded-3xl'
}

// Max width styling
const maxWidthClasses = {
  none: 'w-full',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl'
}

// Alignment styling
const alignClass = computed(() => {
  const alignMap = {
    left: '',
    center: 'mx-auto',
    right: 'ml-auto'
  }
  return alignMap[attrs.value.align] || ''
})

// Dynamic card styling
const cardStyle = computed(() => ({
  backgroundColor: attrs.value.backgroundColor,
  borderColor: attrs.value.borderColor,
  borderWidth: attrs.value.borderWidth,
  padding: attrs.value.padding
}))

// Watch for external attribute changes
watch(() => props.node.attrs, (newAttrs) => {
  attrs.value = newAttrs
  selectedVariant.value = newAttrs.variant
  localShadow.value = newAttrs.shadow
  localMaxWidth.value = newAttrs.maxWidth
  localClickable.value = newAttrs.clickable
}, { deep: true })

// Update methods
const updateVariant = () => {
  attrs.value.variant = selectedVariant.value
  props.updateAttrs(attrs.value)
}

const updateShadow = () => {
  attrs.value.shadow = localShadow.value
  props.updateAttrs(attrs.value)
}

const updateBorderRadius = (radius) => {
  attrs.value.borderRadius = radius
  props.updateAttrs(attrs.value)
}

const updateMaxWidth = () => {
  attrs.value.maxWidth = localMaxWidth.value
  props.updateAttrs(attrs.value)
}

const updateClickable = () => {
  attrs.value.clickable = localClickable.value
  props.updateAttrs(attrs.value)
}
</script>
