# ProseMirror Node Implementation - Functional Template

## System Context
You are implementing a custom node for a ProseMirror editor with Vue 3 components. Follow the patterns from provided examples exactly.

---

## Component Specification

### Node Name: `Hero`

**Type:** Container

**Description:** Large prominent section typically used at the top of pages for showcasing key content with optional background media and overlay effects.

**Attributes:**
```javascript
attrs: {
    height: { default: 'auto' },              // auto | screen | percentage value
    backgroundImage: { default: null },        // URL string or null
    backgroundVideo: { default: null },        // URL string or null
    overlay: { default: 0 },                   // 0-100 opacity percentage
    overlayColor: { default: '#000000' },      // hex color string
    textAlign: { default: 'center' },          // left | center | right
    verticalAlign: { default: 'center' },      // top | center | bottom
    padding: { default: 'large' }              // none | small | medium | large
}
```

**Content Rules:**
- Can contain: `block+`
- Belongs to group: `block`
- Defining: `true`

**Commands Needed:**
1. `setHero`: Creates a new hero section with default attributes at the current selection

**Menu Configuration:**
- Icon: 🎭
- Title: Hero Section
- Group: layout
- Should show in menu: yes

**Interactive Behaviors:**
- Controls to toggle between auto/screen height
- Image URL input for background image
- Video URL input for background video
- Overlay opacity slider (0-100)
- Color picker for overlay color
- Text alignment buttons (left/center/right)
- Vertical alignment buttons (top/center/bottom)
- Padding size selector (none/small/medium/large)

**Special Requirements:**
- Background video should have controls hidden and loop automatically
- Overlay should be applied on top of background media
- Content should be vertically and horizontally aligned according to attributes
- Height "screen" should equal 100vh
- Must maintain readability of content regardless of background

---

## Implementation Requirements

### File 1: `hero.js`

Create a Node class following this structure:

```javascript
import { Node } from '@/editor/node.js'
import { HeroView } from '@/components/editor/views'
import { createAtomCommand } from '@/editor/utils.js'

export class Hero extends Node {
    get schema() {
        return {
            // Define based on specification above
            // Container: content, group, defining
            // Atom: atom, selectable, group, inline, draggable
            attrs: { /* from spec */ },
            parseDOM: [/* parsing rules */],
            toDOM(node) {
                // Return DOM structure
                // Use 0 for content nodes to mark content location
            }
        }
    }

    get component() {
        return HeroView
    }

    get menuItem() {
        // Return menu configuration from spec
        // Return null if showInMenu is false
    }

    get commands() {
        // Implement commands from spec
        // Use createAtomCommand for simple cases
        // Use custom command function for complex initialization
    }
}
```

**Critical Rules:**
1. **Container nodes:** Must include `content`, `group`, `defining: true`, and use `0` in `toDOM`
2. **Atom nodes:** Must include `atom: true`, `selectable`, no content
3. **Custom commands:** If node needs multiple children on creation, write custom command (don't use `createAtomCommand`)
4. **Parent-child relationships:** Child uses `group: "parentGroup"`, parent uses `content: "parentGroup+"`

---

### File 2: `Hero.vue`

Create a Vue component following this structure:

```vue
<template>
  <div>
    <!-- Functional structure only -->
    <!-- Include prose-content attribute for container nodes -->
    <!-- Add functional CSS only (display, positioning, visibility) -->
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

// Implement component logic
const attrs = ref(props.node.attrs)

// Watch for external changes
watch(() => props.node.attrs, (newAttrs) => {
    attrs.value = newAttrs
}, { deep: true })

// Implement update functions
const updateAttribute = (key, value) => {
    attrs.value[key] = value
    props.updateAttrs(attrs.value)
}
</script>
```

**Required Patterns:**

**For Container Nodes:**
```html
<div>
  <!-- Your wrapper -->
  <div prose-content></div>
</div>
```

**For Attribute Updates:**
```javascript
const updateSomething = () => {
    attrs.value.someAttr = newValue
    props.updateAttrs(attrs.value)
}
```

**For Interactive Controls:**
```html
<select v-model="selectedValue" @change="updateAttribute('key', selectedValue)">
  <option>...</option>
</select>

<button @click="doSomething">Action</button>
```

**For Computed Styles (functional only):**
```javascript
const functionalStyle = computed(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${props.node.attrs.columns}, 1fr)`,
    opacity: props.node.attrs.visible ? 1 : 0
}))
```

---

## Styling Guidelines (Functional Only)

Apply ONLY these functional styles in the Vue component:

**Allowed (Functional):**
- Layout properties: `display`, `position`, `grid-template-*`, `flex-*`
- Visibility: `opacity`, `visibility`, `pointer-events`
- Dimensions needed for functionality: `min-height`, `width` (if required)
- Transitions for interactive states: `transition-opacity`

**Not Allowed (Decorative):**
- Colors: `background`, `border-color`, `text-color`
- Spacing: `padding`, `margin`, `gap` (unless functional requirement)
- Typography: `font-size`, `font-weight`, `line-height`
- Borders: `border-width`, `border-style`, `border-radius`
- Shadows, effects, decorative pseudo-elements

**Example Functional CSS:**
```html
<!-- ✅ Functional: Grid structure -->
<div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">

<!-- ✅ Functional: Hover visibility -->
<div class="opacity-0 group-hover:opacity-100 transition-opacity">

<!-- ✅ Functional: Positioning -->
<div class="absolute top-0 right-0 pointer-events-none">

<!-- ❌ Decorative: Will be added in styling phase -->
<div class="bg-blue-500 border-2 rounded-lg p-4 shadow-lg">
```

**Use minimal Tailwind utility classes:**
- `relative`, `absolute`, `fixed` (positioning)
- `flex`, `grid`, `block`, `inline-block` (display)
- `opacity-*`, `group`, `group-hover:` (visibility)
- `transition-*` (animations)
- `pointer-events-none` (interactions)

---

## Validation Checklist

Before submitting implementation:

**Schema:**
- [ ] Correct `content` or `atom` specification
- [ ] `defining: true` for containers
- [ ] `toDOM` includes `0` for content nodes
- [ ] All attributes have default values

**Commands:**
- [ ] Commands return `(state, dispatch, view) => boolean`
- [ ] Complex initialization uses custom command (not `createAtomCommand`)
- [ ] Transactions properly dispatch

**Vue Component:**
- [ ] Props interface matches standard
- [ ] `prose-content` attribute present for containers
- [ ] `attrs` is reactive ref
- [ ] `updateAttrs` called for all changes
- [ ] Watch implemented for external changes

**Functionality:**
- [ ] All interactive behaviors from spec work
- [ ] Attributes update correctly
- [ ] Content editable (for containers)
- [ ] No console errors

**Styling:**
- [ ] Only functional CSS applied
- [ ] No decorative styles
- [ ] Component structure is clear

---

## Output Format

Provide:
1. Complete `hero.js` file
2. Complete `Hero.vue` file
3. Brief explanation of any non-obvious implementation decisions

Do not include:
- Decorative styling
- Example usage code
- Testing code
- Additional helper functions not specified

---

## Example Custom Command (for complex initialization)

```javascript
get commands() {
    return {
        setMyNode: (attrs = {}) => (state, dispatch) => {
            const { schema } = state
            
            // Create child nodes if needed
            const children = Array.from({ length: attrs.count }, () =>
                schema.nodes.childNode.create(
                    { /* child attrs */ },
                    schema.nodes.paragraph.create()
                )
            )
            
            // Create main node
            const node = schema.nodes.myNode.create(attrs, children)
            
            // Replace selection
            const tr = state.tr.replaceSelectionWith(node)
            dispatch(tr)
            return true
        }
    }
}
```

---

## Notes

- Follow examples exactly - do not improvise architecture
- Node name defaults to class name lowercased
- Container nodes must have `content` and `defining: true`
- Use `prose-content` attribute for content areas
- Update attrs via `props.updateAttrs()` only
- Keep component functional - styling comes in phase 2