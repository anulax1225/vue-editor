<template>
    <div class="relative group" :style="containerStyle">
      <!-- Background Video -->
      <video
        v-if="attrs.backgroundVideo"
        :src="attrs.backgroundVideo"
        autoplay
        loop
        muted
        playsinline
        class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      ></video>
  
      <!-- Background Image -->
      <div
        v-else-if="attrs.backgroundImage"
        class="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
        :style="{ backgroundImage: `url(${attrs.backgroundImage})` }"
      ></div>
  
      <!-- Overlay -->
      <div
        v-if="attrs.overlay > 0"
        class="absolute inset-0 pointer-events-none"
        :style="overlayStyle"
      ></div>
  
      <!-- Content Container -->
      <div
        prose-content
        class="relative"
        :style="contentStyle"
      ></div>
  
      <!-- Hover Controls Panel -->
      <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="secondary" size="sm">
              <Settings class="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80" align="end">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Hero Settings</h4>
                <p class="text-sm text-muted-foreground">
                  Configure the hero section appearance
                </p>
              </div>
  
              <!-- Height Control -->
              <div class="grid gap-2">
                <Label>Height</Label>
                <Select v-model="attrs.height" @update:model-value="updateAttribute('height', $event)">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="screen">Full Screen (100vh)</SelectItem>
                    <SelectItem value="75">75% Screen</SelectItem>
                    <SelectItem value="50">50% Screen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <!-- Background Image URL -->
              <div class="grid gap-2">
                <Label>Background Image URL</Label>
                <Input
                  v-model="attrs.backgroundImage"
                  placeholder="https://example.com/image.jpg"
                  @input="updateAttribute('backgroundImage', $event.target.value)"
                />
              </div>
  
              <!-- Background Video URL -->
              <div class="grid gap-2">
                <Label>Background Video URL</Label>
                <Input
                  v-model="attrs.backgroundVideo"
                  placeholder="https://example.com/video.mp4"
                  @input="updateAttribute('backgroundVideo', $event.target.value)"
                />
              </div>
  
              <Separator />
  
              <!-- Overlay Opacity -->
              <div class="grid gap-2">
                <div class="flex items-center justify-between">
                  <Label>Overlay Opacity</Label>
                  <span class="text-sm text-muted-foreground">{{ attrs.overlay }}%</span>
                </div>
                <Slider
                  :model-value="[attrs.overlay]"
                  :max="100"
                  :step="1"
                  @update:model-value="updateAttribute('overlay', $event[0])"
                />
              </div>
  
              <!-- Overlay Color -->
              <div class="grid gap-2">
                <Label>Overlay Color</Label>
                <div class="flex gap-2">
                  <Input
                    v-model="attrs.overlayColor"
                    type="color"
                    class="w-12 h-10 p-1"
                    @input="updateAttribute('overlayColor', $event.target.value)"
                  />
                  <Input
                    v-model="attrs.overlayColor"
                    placeholder="#000000"
                    @input="updateAttribute('overlayColor', $event.target.value)"
                  />
                </div>
              </div>
  
              <Separator />
  
              <!-- Text Alignment -->
              <div class="grid gap-2">
                <Label>Text Alignment</Label>
                <ToggleGroup
                  type="single"
                  :model-value="attrs.textAlign"
                  @update:model-value="updateAttribute('textAlign', $event)"
                >
                  <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeft class="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center">
                    <AlignCenter class="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRight class="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
  
              <!-- Vertical Alignment -->
              <div class="grid gap-2">
                <Label>Vertical Alignment</Label>
                <ToggleGroup
                  type="single"
                  :model-value="attrs.verticalAlign"
                  @update:model-value="updateAttribute('verticalAlign', $event)"
                >
                  <ToggleGroupItem value="top" aria-label="Align top">
                    <ArrowUp class="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center">
                    <Minus class="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="bottom" aria-label="Align bottom">
                    <ArrowDown class="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
  
              <!-- Padding -->
              <div class="grid gap-2">
                <Label>Padding</Label>
                <Select v-model="attrs.padding" @update:model-value="updateAttribute('padding', $event)">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
  
      <!-- Visual Indicator on Hover -->
      <div class="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover'
  import { Slider } from '@/components/ui/slider'
  import { Separator } from '@/components/ui/separator'
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from '@/components/ui/toggle-group'
  import {
    Settings,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ArrowUp,
    ArrowDown,
    Minus,
  } from 'lucide-vue-next'
  
  const props = defineProps({
    node: { type: Object, required: true },
    view: { type: Object, required: true },
    getPos: { type: Function, required: true },
    updateAttrs: { type: Function, required: true }
  })
  
  // Reactive attributes
  const attrs = ref(props.node.attrs)
  
  // Watch for external changes
  watch(() => props.node.attrs, (newAttrs) => {
    attrs.value = newAttrs
  }, { deep: true })
  
  // Update attribute function
  const updateAttribute = (key, value) => {
    attrs.value[key] = value
    props.updateAttrs(attrs.value)
  }
  
  // Container style (functional)
  const containerStyle = computed(() => {
    const styles = {
      position: 'relative',
      display: 'flex'
    }
  
    // Height
    if (attrs.value.height === 'screen') {
      styles.minHeight = '100vh'
    } else if (attrs.value.height === '75') {
      styles.minHeight = '75vh'
    } else if (attrs.value.height === '50') {
      styles.minHeight = '50vh'
    }
  
    return styles
  })
  
  // Overlay style (functional)
  const overlayStyle = computed(() => ({
    backgroundColor: attrs.value.overlayColor,
    opacity: attrs.value.overlay / 100
  }))
  
  // Content style (functional)
  const contentStyle = computed(() => {
    const styles = {
      display: 'flex',
      width: '100%'
    }
  
    // Text alignment
    if (attrs.value.textAlign === 'left') {
      styles.justifyContent = 'flex-start'
    } else if (attrs.value.textAlign === 'center') {
      styles.justifyContent = 'center'
    } else if (attrs.value.textAlign === 'right') {
      styles.justifyContent = 'flex-end'
    }
  
    // Vertical alignment
    if (attrs.value.verticalAlign === 'top') {
      styles.alignItems = 'flex-start'
    } else if (attrs.value.verticalAlign === 'center') {
      styles.alignItems = 'center'
    } else if (attrs.value.verticalAlign === 'bottom') {
      styles.alignItems = 'flex-end'
    }
  
    // Padding (functional minimum for spacing)
    const paddingMap = {
      none: '0',
      small: '1rem',
      medium: '2rem',
      large: '4rem'
    }
    styles.padding = paddingMap[attrs.value.padding] || paddingMap.large
  
    return styles
  })
  </script>