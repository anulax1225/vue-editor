# ProseMirror Custom Editor - Node Implementation Cheat Sheet

## 🏗️ Core Architecture

### Node Class Structure
```javascript
import { Node } from '@/editor/node.js'
import { YourView } from '@/components/editor/views'
import { createAtomCommand } from '@/editor/utils.js'

export class YourNode extends Node {
    // Node name defaults to class name lowercased
    // Override with: get name() { return 'customName' }
    
    get schema() { /* ProseMirror schema */ }
    get component() { /* Vue component */ }
    get menuItem() { /* Menu config */ }
    get commands() { /* Editor commands */ }
}
```

---

## 📋 Schema Patterns

### Atom Node (No Content)
```javascript
get schema() {
    return {
        atom: true,           // Can't contain content
        selectable: false,    // Can't be selected
        group: 'block',       // or 'inline'
        inline: false,        // Block-level
        draggable: false,
        attrs: {
            // Your attributes
            count: { default: 0 }
        },
        parseDOM: [{ 
            tag: 'div[data-your-node]',
            getAttrs: dom => ({ /* parse attrs */ })
        }],
        toDOM: node => ['div', { 'data-your-node': '' }]
    }
}
```

### Container Node (Has Content)
```javascript
get schema() {
    return {
        content: "block+",      // Can contain blocks
        group: "block",         // Is a block itself
        defining: true,         // Content can't escape
        attrs: {
            variant: { default: "info" }
        },
        parseDOM: [{
            tag: "div[data-callout]",
            getAttrs: dom => ({ /* parse */ })
        }],
        toDOM(node) {
            return [
                "div",
                { "data-callout": "" },
                0  // ← CRITICAL: "0" = where child content goes
            ]
        }
    }
}
```

### Nested Relationship (Parent → Child)
```javascript
// Parent (Grid)
{
    content: "gridItem+",  // ONLY accepts gridItem children
    group: "block"
}

// Child (GridItem)
{
    content: "block+",     // Can contain any blocks
    group: "gridItem",     // ← Identifies itself to parent
    defining: true
}
```

---

## 🎯 Commands

### createAtomCommand Signature
```javascript
createAtomCommand(name, attr = null, asContent = false)
```
- **name**: Node type name (string)
- **attr**: Initial attributes (object)
- **asContent**: If `true`, creates ONE paragraph as child

### Simple Command
```javascript
get commands() {
    return {
        setYourNode: (attrs = {}) => createAtomCommand(this.name, attrs, false)
    }
}
```

### Custom Command (Complex Initialization)
```javascript
get commands() {
    return {
        setGrid: (attrs = { columns: 2, rows: 2 }) => (state, dispatch) => {
            const { schema } = state;
            
            // Create multiple children
            const gridItems = Array.from({ length: 4 }, () => 
                schema.nodes.gridItem.create(
                    { /* gridItem attrs */ },
                    schema.nodes.paragraph.create()
                )
            );
            
            // Create parent with children
            const grid = schema.nodes.grid.create(attrs, gridItems);
            
            // Replace selection
            const tr = state.tr.replaceSelectionWith(grid);
            dispatch(tr);
            return true;
        }
    }
}
```

### Attribute Update Command
```javascript
changeVariant: (variant) => (state, dispatch) => {
    const { $from } = state.selection;
    let depth = $from.depth;
    
    // Walk up tree to find our node
    while (depth >= 0) {
        const node = $from.node(depth);
        if (node.type.name === this.name) {
            const pos = $from.before(depth);
            const tr = state.tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                variant
            });
            dispatch?.(tr);
            return true;
        }
        depth--;
    }
    return false;
}
```

---

## 🎨 Vue Component Integration

### Required Props
```javascript
const props = defineProps({
    node: { type: Object, required: true },      // ProseMirror node
    view: { type: Object, required: true },      // Editor view (non-reactive)
    getPos: { type: Function, required: true },  // Get node position
    updateAttrs: { type: Function, required: true }, // Update attributes
    editor: { type: Object }                     // Editor instance (optional)
})
```

### Content Area Marker
```html
<!-- In Vue template -->
<div prose-content></div>
<!-- ↑ VueNodeAdapter looks for this attribute to set contentDOM -->
```

### Updating Attributes
```javascript
const attrs = ref(props.node.attrs)

const updateSomething = () => {
    attrs.value.someProperty = newValue;
    props.updateAttrs(attrs.value);  // ← Triggers ProseMirror transaction
}
```

### Watching Node Changes
```javascript
watch(() => props.node.attrs.variant, (newVal) => {
    selectedVariant.value = newVal
})
```

### Deleting Node
```javascript
const deleteNode = () => {
    const pos = props.getPos()
    const tr = props.view.state.tr.delete(pos, pos + props.node.nodeSize)
    props.view.dispatch(tr)
}
```

---

## 🖼️ VueNodeAdapter Behavior

### Content DOM Detection
```javascript
// Adapter automatically finds prose-content
this.contentDOM = this.dom.querySelector("[prose-content]");
```

### Mutation Handling
```javascript
ignoreMutation(mutation) {
    // DON'T ignore mutations inside contentDOM
    // (ProseMirror needs to track them)
    if (this.contentDOM && this.contentDOM.contains(mutation.target)) {
        return false;  // ← Let ProseMirror handle it
    }
    // Ignore mutations in Vue-controlled areas
    return true;
}
```

### Stop Events (Prevent Editor Interference)
```javascript
stopEvent(event) {
    const target = event.target;
    // Stop events from interactive elements
    if (
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'TEXTAREA'
    ) {
        return true;  // ← Don't let ProseMirror handle it
    }
    return false;
}
```

---

## 🎯 Menu Item Configuration

### Basic Menu Item
```javascript
get menuItem() {
    return [
        {
            icon: '📊',
            title: 'Grid',
            action: () => this.editor.chain().setGrid().run(),
            group: "blocks",  // or "layout", "media", etc.
            isActive: () => this.isActive(),
        }
    ]
}
```

### Multiple Menu Items (Variants)
```javascript
get menuItem() {
    return [
        {
            icon: 'ℹ️',
            title: 'Info Callout',
            action: () => this.editor.chain().setCallout('info').run(),
            isActive: () => this.isActive('info'),
            group: "blocks",
        },
        {
            icon: '⚠️',
            title: 'Warning Callout',
            action: () => this.editor.chain().setCallout('warning').run(),
            isActive: () => this.isActive('warning'),
            group: "blocks",
        }
    ]
}
```

### isActive Implementation
```javascript
isActive(variant) {
    const { $from } = this.editor.state.selection;
    let depth = $from.depth;
    
    // Walk up tree to find our node
    while (depth >= 0) {
        const node = $from.node(depth);
        if (node.type.name === this.name) {
            return variant ? node.attrs.variant === variant : true;
        }
        depth--;
    }
    return false;
}
```

---

## 🎨 Styling Patterns

### Hover States (Tailwind)
```html
<div class="relative group">
    <!-- Node content -->
    
    <!-- Hover overlay -->
    <div class="absolute inset-0 border-2 border-dashed border-blue-300 
                opacity-0 group-hover:opacity-100 pointer-events-none 
                transition-opacity">
    </div>
    
    <!-- Hover controls -->
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                flex gap-2 transition-opacity">
        <button>⚙️</button>
    </div>
</div>
```

### Selected State
```html
<div :class="{ 'ring-2 ring-blue-500 ring-offset-2': selected }">
    <!-- ProseMirror adds 'ProseMirror-selectednode' class automatically -->
</div>
```

### Dynamic Grid Styles
```javascript
const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.node.attrs.columns}, 1fr)`,
    gridTemplateRows: `repeat(${props.node.attrs.rows}, auto)`,
    gap: `${props.node.attrs.gap}px`
}))
```

```html
<div class="grid" :style="gridStyle">
    <div prose-content class="contents"></div>
</div>
```

---

## 🔧 Common Patterns

### Editable Text in Node
```html
<input 
    v-if="editing" 
    v-model="text" 
    @blur="save"
    @keydown.enter.prevent="save"
    @keydown.esc.prevent="cancel"
/>
<span v-else @dblclick="startEditing">{{ text }}</span>
```

### Interactive Controls
```html
<select v-model="selectedVariant" @change="updateVariant">
    <option value="info">Info</option>
    <option value="warning">Warning</option>
</select>
```

### Loading States
```html
<div v-if="isLoading" class="animate-pulse bg-gray-200">
    <!-- Skeleton -->
</div>
<div v-else>
    <!-- Actual content -->
</div>
```

---

## ⚠️ Critical Gotchas

1. **Content vs Atom**: 
   - Atom nodes: `atom: true`, no `content`, `asContent: false`
   - Container nodes: `content: "block+"`, `defining: true`, may use `asContent: true`

2. **toDOM "0" Marker**:
   - In `toDOM`, use `0` to mark where child content goes
   - Without it, content won't render!

3. **prose-content Attribute**:
   - MUST be present in Vue template for content nodes
   - Adapter uses it to set `contentDOM`

4. **Group Semantics**:
   - `group: "block"` = can appear in normal flow
   - Custom groups (e.g., `"gridItem"`) = for parent-child relationships

5. **createAtomCommand Limitations**:
   - Only creates ONE child paragraph when `asContent: true`
   - For complex structures, write custom commands

6. **Mutation Handling**:
   - Areas with `prose-content`: ProseMirror tracks
   - Areas without: Vue controls, mutations ignored

7. **Event Stopping**:
   - Interactive elements (buttons, inputs) need `stopEvent: true`
   - Already handled by VueNodeAdapter for INPUT, SELECT, BUTTON, TEXTAREA

8. **Reactivity**:
   - `view` is marked non-reactive in adapter
   - Use `ref()` or `computed()` for local state
   - Always use `props.updateAttrs()` to update node

---

## 🚀 Command Execution Flow

```
User Action:
editor.chain().setGrid({ columns: 3 }).run()

Internal Flow:
1. Proxy intercepts "setGrid"
2. Searches all extensions for commands.setGrid
3. Finds Grid.commands.setGrid
4. Calls: setGrid({ columns: 3 })
5. Returns: (state, dispatch, view) => { /* ... */ }
6. Adds to commands array
7. .run() executes all commands sequentially
8. Each command:
   - Receives (state, dispatch, view)
   - Creates transaction
   - Calls dispatch(tr)
   - Returns true/false for success
```

---

## 📦 Registration

```javascript
const editor = new Editor({
    element: editorElement,
    extensions: [
        new Grid(),
        new GridItem(),
        new Callout(),
        // ... other nodes
    ]
})
```

---

## 🎓 Best Practices

1. **Always use `defining: true`** for container nodes to prevent content escaping
2. **Watch for attribute changes** in Vue components with `watch()`
3. **Use `computed()`** for derived values like styles
4. **Implement proper cleanup** in `onBeforeUnmount()`
5. **Test nested structures** thoroughly (Grid → GridItem, Details → blocks)
6. **Use Tailwind's `group`** for hover states on layout nodes
7. **Provide visual feedback** for interactive elements
8. **Handle loading/error states** gracefully
9. **Use semantic HTML** in `toDOM` when possible
10. **Keep commands pure** - no side effects, return boolean

---

## 📚 Quick Reference

| Pattern | Use When |
|---------|----------|
| `atom: true` | Node can't contain content (images, widgets) |
| `content: "block+"` | Node contains blocks (callouts, details) |
| `defining: true` | Content shouldn't escape container |
| `prose-content` | Mark where ProseMirror content renders |
| `createAtomCommand` | Simple initialization |
| Custom command | Complex initialization (multiple children) |
| `props.updateAttrs()` | Change node attributes |
| `group: "block"` | Standard block-level node |
| Custom group | Parent-child relationships |
| `0` in toDOM | Where child content goes |

---

## 🔍 Debugging Tips

1. **Content not showing?** → Check for `prose-content` attribute
2. **Can't edit content?** → Check `ignoreMutation` implementation
3. **Attributes not updating?** → Use `props.updateAttrs()`, not direct mutation
4. **Commands not found?** → Check node registration in Editor
5. **Vue reactivity issues?** → Use `ref()` for mutable state
6. **Selection problems?** → Check `selectable` and `atom` flags
7. **Content escaping?** → Add `defining: true` to schema
