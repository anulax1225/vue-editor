# Vue Component Styling Task

## Task
Apply visual styling to an existing functional Vue component based on provided style guidelines. Do not modify functionality or component logic.

---

## Inputs

1. **Vue Component File** - Functional component with minimal styling
2. **Style Guide** - Design specifications and styling rules
3. **Component Context** (optional) - Usage context and visual hierarchy

---

## Styling Requirements

### What to Modify
Apply visual styling to make the component match the style guide lines in **STYLE_GUIDE_LINE.md**

---

### What NOT to Modify

**Preserve Functionality:**
- Do not change `<script setup>` logic
- Do not modify prop definitions
- Do not alter reactive refs or computed properties
- Do not change event handlers or methods
- Keep all `@click`, `@change`, etc. handlers unchanged
- Preserve `v-model` bindings

**Preserve Structure:**
- Do not add/remove `prose-content` attributes
- Do not change core HTML structure if it breaks functionality
- Do not modify `:style` bindings that control functional CSS
- Keep existing `v-if`, `v-show`, `v-for` directives

**You MAY:**
- Add wrapper divs for styling purposes
- Add decorative elements (icons, borders, backgrounds)
- Change Tailwind utility classes
- Add/modify `:class` bindings for visual states
- Wrap content in styled containers

---

## Implementation Guidelines

### Use Tailwind CSS
Apply styling using Tailwind utility classes:

```html
<!-- Before (functional only) -->
<div class="relative group">
  <div class="opacity-0 group-hover:opacity-100">
    <button @click="doSomething">Action</button>
  </div>
</div>

<!-- After (styled) -->
<div class="relative group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="opacity-0 group-hover:opacity-100 transition-opacity">
    <button @click="doSomething" 
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
      Action
    </button>
  </div>
</div>
```

### Style Layering
Apply styles in this priority order:

1. **Base Structure** - Layout, display, positioning
2. **Visual Foundation** - Backgrounds, borders, basic colors
3. **Typography** - Font sizes, weights, colors, line heights
4. **Spacing** - Padding, margins, gaps
5. **Effects** - Shadows, transitions, transforms
6. **States** - Hover, focus, active, disabled

### Common Patterns

**Container Styling:**
```html
<div class="bg-white border border-gray-200 rounded-lg shadow-sm">
```

**Interactive Elements:**
```html
<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
               text-white font-medium rounded-md transition-colors
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
```

**Form Controls:**
```html
<select class="px-3 py-2 bg-white border border-gray-300 rounded-md
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               text-sm">
```

**Icons/Badges:**
```html
<span class="inline-flex items-center justify-center w-6 h-6 
             bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
```

**Hover Controls:**
```html
<div class="absolute top-2 right-2 
            flex gap-2 items-center
            px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg
            opacity-0 group-hover:opacity-100 transition-opacity">
```

---

## Style Consistency

### Color Palette (adjust based on style guide)
- Primary: `blue-*` 
- Secondary: `gray-*`
- Success: `green-*`
- Warning: `amber-*`
- Error: `red-*`
- Info: `sky-*`

### Spacing Scale
- Tight: `gap-1`, `p-1`, `m-1`
- Normal: `gap-2`, `p-2`, `m-2` to `gap-4`, `p-4`, `m-4`
- Loose: `gap-6`, `p-6`, `m-6`

### Border Radius
- Small: `rounded` or `rounded-md`
- Medium: `rounded-lg`
- Large: `rounded-xl`
- Full: `rounded-full`

### Shadows
- Subtle: `shadow-sm`
- Normal: `shadow`
- Prominent: `shadow-md` or `shadow-lg`

### Transitions
Always include transitions for interactive elements:
```html
class="... transition-colors duration-200"
class="... transition-opacity duration-150"
class="... transition-shadow duration-200"
```

---

## Dark Mode (if required)

Add dark mode variants:
```html
<div class="bg-white dark:bg-gray-800 
            border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100">
```

---

## Accessibility

Ensure styles maintain accessibility:

**Focus States:**
```html
class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

**Color Contrast:**
- Text on backgrounds must meet WCAG AA standards
- Use `text-gray-700` or darker on light backgrounds
- Use `text-gray-200` or lighter on dark backgrounds

**Interactive Feedback:**
- Hover states must be visible
- Active/pressed states should be distinct
- Disabled states should be clearly indicated

---

## Output Format

Provide:

1. **Styled Vue Component** - Complete `.vue` file with styling applied
2. **Changes Summary** - Brief list of major styling changes made
3. **Notes** (if any) - Any deviations from style guide with reasoning

**Do NOT include:**
- Modified functionality
- Changed prop definitions
- New reactive logic
- Additional component features
- Testing code

---

## Validation Checklist

Before submitting:

**Functionality Preserved:**
- [ ] All interactive behaviors still work
- [ ] Props interface unchanged
- [ ] Event handlers unchanged
- [ ] Reactive logic intact
- [ ] `prose-content` attributes preserved

**Styling Applied:**
- [ ] Follows style guide specifications
- [ ] Consistent with design system
- [ ] All interactive states styled
- [ ] Hover/focus states implemented
- [ ] Transitions smooth
- [ ] Spacing consistent

**Quality:**
- [ ] No hardcoded colors (use Tailwind classes)
- [ ] Responsive if needed
- [ ] Accessible (focus states, contrast)
- [ ] Clean, readable code
- [ ] No console errors

---

## Example Transformation

### Before (Functional)
```vue
<template>
  <div class="relative group">
    <div class="opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="updateVariant('info')">Info</button>
      <button @click="updateVariant('warning')">Warning</button>
    </div>
    <div prose-content></div>
  </div>
</template>

<script setup>
const props = defineProps({
  node: Object,
  updateAttrs: Function
})

const updateVariant = (variant) => {
  props.updateAttrs({ variant })
}
</script>
```

### After (Styled)
```vue
<template>
  <div class="relative group my-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
    <!-- Hover Controls -->
    <div class="absolute -top-12 right-0 
                flex gap-2 items-center
                px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg
                opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="updateVariant('info')"
              class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors">
        Info
      </button>
      <button @click="updateVariant('warning')"
              class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors">
        Warning
      </button>
    </div>
    
    <!-- Content Area -->
    <div prose-content class="prose prose-sm max-w-none"></div>
  </div>
</template>

<script setup>
// ✅ Unchanged - functionality preserved
const props = defineProps({
  node: Object,
  updateAttrs: Function
})

const updateVariant = (variant) => {
  props.updateAttrs({ variant })
}
</script>
```

---

## Notes

- Focus on visual improvements only
- Preserve all functional code
- Use Tailwind utilities consistently
- Add transitions for smoothness
- Maintain accessibility
- Follow style guide closely
