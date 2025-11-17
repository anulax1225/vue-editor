# Vue Component Style Guide

## Table of Contents
1. [Color Palette & Theme](#color-palette--theme)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component Structure](#component-structure)
5. [Interactive States](#interactive-states)
6. [Animations & Transitions](#animations--transitions)
7. [Icons & Images](#icons--images)
8. [Buttons & Controls](#buttons--controls)
9. [Forms & Inputs](#forms--inputs)
10. [Modals & Overlays](#modals--overlays)
11. [Navigation & Trees](#navigation--trees)
12. [Cards & Panels](#cards--panels)
13. [Best Practices](#best-practices)

---

## Color Palette & Theme

### Base Colors
```css
/* Background Colors */
--bg-darkest: bg-gray-900      /* Main background, sidebars */
--bg-dark: bg-gray-800          /* Secondary background, cards */
--bg-medium: bg-gray-700        /* Interactive elements, hover states */
--bg-light: bg-gray-600         /* Lighter backgrounds */

/* Text Colors */
--text-primary: text-white      /* Primary text */
--text-secondary: text-gray-200 /* Secondary text */
--text-muted: text-gray-300     /* Muted text */
--text-faded: text-gray-500     /* Counts, metadata */

/* Accent Colors */
--accent-primary: bg-blue-600   /* Primary actions */
--accent-hover: hover:bg-blue-600
--accent-danger: bg-red-600     /* Destructive actions */
--accent-danger-hover: hover:bg-red-500
```

### Opacity Patterns
```css
/* Background Overlays */
bg-black/10     /* Subtle overlay */
bg-black/20     /* Medium overlay */
bg-gray-900/75  /* Control backgrounds on images */
bg-gray-600/90  /* Drag-and-drop overlays */

/* Transparency */
bg-transparent  /* Fully transparent elements */
```

---

## Typography

### Font Sizes
```css
text-xs     /* Tags, small metadata (12px) */
text-sm     /* Secondary text (14px) */
text-md     /* Breadcrumbs, navigation items (16px) */
text-lg     /* Section text (18px) */
text-xl     /* Card titles, headings (20px) */
text-2xl    /* Page titles (24px) */
```

### Font Weights
```css
font-normal     /* Default text */
font-medium     /* Hover states, emphasis */
font-bold       /* Primary headings, titles */
```

### Text Utilities
```css
text-nowrap     /* Prevent text wrapping */
text-white      /* Primary readable text */
text-gray-300   /* Secondary readable text */
text-gray-500   /* Metadata, counts */
```

---

## Spacing & Layout

### Grid Patterns
```css
/* Responsive Grid - Asset/Card Layouts */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Two-Column Layout */
grid grid-cols-2 items-center

/* Full-Width Spanning */
col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4
```

### Flex Patterns
```css
/* Horizontal Layout */
flex items-center justify-between  /* Space-between alignment */
flex items-center justify-center   /* Centered content */
flex items-center justify-end      /* Right-aligned content */

/* Vertical Layout */
flex flex-col

/* Wrapping */
flex flex-wrap
flex-nowrap
```

### Spacing Scale
```css
/* Padding */
p-1    /* 4px  - Tight spacing */
p-2    /* 8px  - Default button padding */
p-3    /* 12px - Medium padding */
px-2   /* Horizontal padding */
py-2   /* Vertical padding */
px-4 py-2  /* Standard button padding */
px-6 p-2   /* Header padding */

/* Margin */
m-1, m-2, m-3, m-4  /* Standard margins */
mx-1, my-1          /* Horizontal/vertical margins */
mb-1, mb-2          /* Bottom margins */
ml-1, mr-1          /* Left/right margins */

/* Gaps */
(No explicit gap utilities used - spacing through margins)
```

---

## Component Structure

### Script Setup Pattern
```vue
<script setup>
import { ref, reactive, onMounted } from 'vue';

// Props definition
const props = defineProps({
    propertyName: {
        type: Object | Array | String | Boolean | Number,
        default: () => ({}), // Or [], "", false, 0
        required: false
    }
});

// Emits definition
const emits = defineEmits(["eventName", "anotherEvent"]);

// Reactive state
const state = reactive({ 
    property: value 
});
const refValue = ref(initialValue);

// Methods
const methodName = () => {
    // Implementation
};

// Lifecycle
onMounted(() => {
    // Initialization
});

// Expose methods to parent
defineExpose({
    publicMethod: () => {}
});
</script>
```

### Template Structure
```vue
<template>
    <div class="outer-container-classes">
        <!-- Primary content -->
        <div class="content-wrapper">
            <!-- Content here -->
        </div>
        
        <!-- Absolute/fixed overlays -->
        <div class="absolute top-0 right-0">
            <!-- Controls -->
        </div>
    </div>
</template>
```

---

## Interactive States

### Hover States
```css
/* Background Changes */
hover:bg-gray-700/50    /* Subtle hover for list items */
hover:bg-gray-700       /* Standard hover */
hover:bg-blue-600       /* Action hover */
hover:bg-red-500        /* Destructive hover */

/* Scale Transforms */
hover:scale-[1.05]      /* Subtle scale */
hover:scale-[1.1]       /* Medium scale */
hover:scale-[1.75]      /* Large scale for icons */

/* Brightness */
group-hover:brightness-110  /* Lighten on hover */
brightness-90               /* Default dimmed state */
```

### Group Hover Pattern
```vue
<div class="group">
    <div class="hidden group-hover:block">
        <!-- Shows on parent hover -->
    </div>
    <div class="group-hover:font-medium">
        <!-- Changes weight on parent hover -->
    </div>
</div>
```

### Active/Selected States
```css
/* Background */
bg-gray-700             /* Active item */
bg-gray-800             /* Active container */

/* Borders */
border-r border-gray-800    /* Subtle borders */
border-b border-gray-800    /* Section dividers */
border-r-2 border-gray-200/40  /* Emphasized dividers */
```

### Conditional Styling
```vue
<template>
    <div 
        class="base-classes"
        :class="{
            'bg-gray-700': isActive,
            'bg-gray-800': isSelected,
            'hidden': !isVisible
        }"
    >
        <!-- Content -->
    </div>
</template>
```

---

## Animations & Transitions

### Transition Utilities
```css
/* Duration */
transition-[filter] duration-500
transition-[padding] duration-500
transition duration-500

/* Filter Transitions */
brightness-90 transition-[filter] duration-500
```

### Transform Animations
```css
/* Rotation */
rotate-90           /* Quarter turn */
rotate-180          /* Flip */
group-hover:scale-[1.1]  /* Scale on hover */

/* Combined with Transitions */
class="h-2 mr-1 dark:invert transition duration-500 rotate-90"
```

### Custom Animations (CSS Classes)
```css
/* Sliding Animations */
.slide-up { /* Custom animation */ }
.slide-out { /* Custom animation */ }
.cart-in { /* Custom animation */ }
.cart-out { /* Custom animation */ }

/* Navigation Animations */
.prev { /* Custom animation */ }
.next { /* Custom animation */ }
.prev-out { /* Custom animation */ }
.next-out { /* Custom animation */ }
```

### Animation Events
```vue
<template>
    <div @animationend="direction = 0">
        <!-- Reset state after animation -->
    </div>
</template>
```

---

## Icons & Images

### Icon Pattern
```css
/* Standard Icon Sizing */
h-2     /* Tiny icons (arrows in trees) */
h-3     /* Small icons (inline actions) */
h-4     /* Medium icons (buttons) */
h-5     /* Standard icons */
h-6     /* Large icons */
h-8     /* Extra large icons */
h-12    /* Modal/navigation icons */

/* Icon Colors */
invert              /* White icons on dark backgrounds */
dark:invert         /* Responsive invert */
pointer-events-none /* Prevent icon click interference */
```

### Image Styling
```css
/* Object Fit */
object-cover        /* Fill container, crop */
object-cover w-full h-full  /* Full container coverage */

/* Sizing */
w-full h-full       /* Full container */
w-96                /* Fixed width sidebar */
h-96                /* Fixed height cards */
h-[95%]             /* Custom height percentage */
max-w-xl            /* Constrained max width */
```

### Image Loading/Display
```vue
<template>
    <!-- With hover effects -->
    <img 
        :src="imageUrl" 
        class="object-cover w-full h-full 
               group-hover:brightness-110 
               brightness-90 
               transition-[filter] duration-500"
    />
    
    <!-- With click handler -->
    <img 
        @click="fullscreen" 
        :src="imageUrl" 
        class="object-cover cursor-pointer"
    />
</template>
```

---

## Buttons & Controls

### Primary Button
```vue
<button class="
    bg-gray-700 
    hover:bg-blue-600 
    text-white 
    px-4 py-2 
    rounded 
    shadow
">
    Button Text
</button>
```

### Icon Button
```vue
<button class="
    bg-gray-900/75 
    mx-1 my-2 
    p-1 
    rounded 
    flex items-center justify-center
">
    <img src="/icons/icon.svg" class="h-5 invert pointer-events-none">
</button>
```

### Danger Button
```vue
<button class="
    bg-red-600 
    hover:bg-red-500 
    text-white 
    px-3 py-3
">
    <img src="/icons/delete.png" class="h-6 invert">
</button>
```

### Navigation Button
```vue
<button class="
    mx-1 
    bg-gray-900/75 
    rounded 
    flex items-center justify-center
">
    <img src="/icons/arrow.svg" class="h-8 invert pointer-events-none">
</button>
```

### Scale on Hover
```vue
<button class="
    group 
    hover:scale-[1.1]
">
    <img src="/icons/icon.svg" class="invert h-3 group-hover:scale-[1.1]">
</button>
```

---

## Forms & Inputs

### Input Error Pattern
```vue
<script setup>
import InputError from '@/Components/InputError.vue';

const errors = reactive({ 
    field: "" 
});
</script>

<template>
    <InputError class="mt-1 ml-2" :message="errors.field" />
    
    <!-- Conditional error styling -->
    <div 
        class="bg-black/10 hover:bg-black/20 p-1 rounded ml-4"
        :class="{'bg-red-500 hover:bg-red-600': errors.field}"
    >
        <!-- Content -->
    </div>
</template>
```

### File Input Pattern
```vue
<template>
    <input 
        @change="fileSelected" 
        :id="'input-id-' + uniqueId" 
        type="file" 
        class="hidden" 
        multiple 
        accept="image/*"
    />
    <button @click="openDialog" class="...">
        Select Files
    </button>
</template>

<script setup>
const openDialog = () => {
    document.querySelector('#input-id-' + uniqueId).click();
};
</script>
```

---

## Modals & Overlays

### Modal Container
```vue
<template>
    <div 
        id="modal-id" 
        class="fixed z-50 top-0 bottom-0 left-0 right-0"
    >
        <div class="relative w-full h-full flex items-center justify-center">
            <!-- Modal content -->
        </div>
    </div>
</template>
```

### Drag & Drop Overlay
```vue
<template>
    <div 
        class="relative w-full h-full"
        @drop="dropFiles" 
        @dragover="Utils.Prevent" 
        @dragenter="showPopup" 
        @dragleave="hidePopup"
    >
        <!-- Overlay -->
        <div class="
            hidden 
            absolute z-20 
            bg-gray-600/90 
            top-0 bottom-0 left-0 right-0 
            pointer-events-none
        ">
            <div class="w-full h-full flex justify-center items-center">
                <img src="/icons/download.png" class="invert absolute h-[80%]">
            </div>
        </div>
        
        <!-- Main content -->
    </div>
</template>
```

### Close Button Pattern
```vue
<template>
    <!-- Top-right close -->
    <div class="absolute right-0 top-0 p-8">
        <button @click="close" class="bg-red-600 p-2">
            <img src="/icons/cancel.svg" class="h-8 invert pointer-events-none">
        </button>
    </div>
</template>
```

---

## Navigation & Trees

### Sidebar Container
```vue
<template>
    <div class="
        sticky top-0 bottom-0 h-full 
        bg-gray-900 
        border-r border-gray-800 
        text-gray-200 
        w-96 
        overflow-auto 
        text-lg 
        pb-32
    ">
        <!-- Navigation content -->
    </div>
</template>
```

### Breadcrumb Pattern
```vue
<template>
    <Breadcrumb class="
        sticky w-96 
        border-b border-gray-800 
        py-2 z-10 top-0 
        bg-gray-900 
        overflow-hidden
    ">
        <BreadcrumbList class="w-full mx-3 flex-nowrap overflow-hidden">
            <BreadcrumbItem 
                class="text-md font-medium cursor-pointer" 
                @click="navigate"
            >
                Item Text
            </BreadcrumbItem>
            <BreadcrumbSeparator />
        </BreadcrumbList>
    </Breadcrumb>
</template>
```

### Tree Node Pattern
```vue
<template>
    <div class="hover:bg-gray-700/50 rounded">
        <div 
            class="
                flex w-full items-center justify-between 
                px-2 rounded py-[0.5px] 
                group
            "
            :class="{ 'bg-gray-700': isActive }"
        >
            <div class="group flex items-center cursor-pointer w-full">
                <!-- Collapse/expand arrow -->
                <img 
                    v-if="hasChildren" 
                    src="/icons/right-arrow.svg" 
                    class="h-2 mr-1 dark:invert transition duration-500" 
                    :class="{'rotate-90': isExpanded}"
                />
                
                <!-- Node text -->
                <p 
                    class="group-hover:font-medium" 
                    :class="{ 'pl-3': !hasChildren }"
                >
                    {{ node.name }}
                    <span class="ml-1 text-gray-500">
                        {{ count ? `(${count})` : '' }}
                    </span>
                </p>
            </div>
            
            <!-- Hover action -->
            <button class="group-hover:block hidden">
                <img src="/icons/create.svg" class="invert h-3">
            </button>
        </div>
        
        <!-- Child nodes -->
        <div 
            class="
                transition-[padding] duration-500 
                overflow-y-hidden
            " 
            :class="isExpanded ? 'my-1 pl-6 pb-1 h-fit' : 'h-0'"
        >
            <!-- Recursive children -->
        </div>
    </div>
</template>
```

---

## Cards & Panels

### Image Card Container
```vue
<template>
    <Link 
        :href="route('asset.show', asset.uuid)" 
        class="
            relative 
            object-cover w-full h-full 
            group 
            bg-gray-800
        "
    >
        <!-- Hover controls (top-right) -->
        <div class="absolute top-0 right-0 z-20 bg-transparent hidden group-hover:block">
            <button class="bg-gray-900/75 mx-1 my-2 p-1 rounded flex items-center justify-center">
                <img src="/icons/icon.svg" class="h-5 invert pointer-events-none">
            </button>
        </div>
        
        <!-- Navigation controls (center) -->
        <div class="
            absolute top-0 bottom-0 left-0 right-0 
            z-10 bg-transparent 
            hidden group-hover:flex 
            items-center justify-between
        ">
            <!-- Prev/Next buttons -->
        </div>
        
        <!-- Main image -->
        <div class="absolute top-0 bottom-0 left-0 right-0">
            <img src="..." class="
                object-cover w-full h-full 
                group-hover:brightness-110 
                brightness-90 
                transition-[filter] duration-500
            "/>
        </div>
        
        <!-- Bottom overlay with info -->
        <div class="
            absolute bottom-0 left-0 right-0 
            bg-black/20 
            font-normal p-2 
            grid grid-cols-2 items-center w-full
        ">
            <div class="w-full">
                <p class="text-xl text-white font-bold mb-2">{{ title }}</p>
                <p class="text-sm text-gray-300">{{ subtitle }}</p>
            </div>
            
            <div class="flex justify-end flex-wrap w-full">
                <!-- Tags -->
                <span 
                    v-for="tag in tags"
                    class="text-xs bg-gray-700 rounded px-2 py-1 my-1 ml-1"
                >
                    {{ tag }}
                </span>
            </div>
        </div>
    </Link>
</template>
```

### Grid Card Layout
```vue
<template>
    <div class="
        relative 
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
        items-center
    ">
        <!-- Sticky header -->
        <div class="
            sticky top-0 left-0 right-0 
            col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 
            z-10 
            bg-gray-700 
            flex items-center justify-between
        ">
            <p class="px-6 p-2 text-xl font-medium">{{ section.name }}</p>
            <Link class="
                group w-fit h-fit font-medium 
                bg-gray-800 hover:bg-blue-600 
                text-white p-2 rounded shadow 
                my-1 mr-2
            ">
                <img src="/icons/create.svg" class="invert h-4 group-hover:scale-[1.1]">
            </Link>
        </div>
        
        <!-- Cards -->
        <div 
            v-for="item in items"
            class="
                relative group 
                mx-auto w-full h-96 
                bg-black-500 
                flex items-center justify-center 
                text-xl font-bold cursor-pointer 
                shadow-sm shadow-gray-900 
                hover:shadow-md 
                overflow-hidden
            "
        >
            <!-- Card content -->
        </div>
    </div>
</template>
```

### Panel with Controls
```vue
<template>
    <div class="group/global w-full h-full flex items-center justify-center bg-black/10 rounded">
        <!-- Bottom control bar -->
        <div class="absolute bottom-0 left-0 right-0">
            <div class="w-full flex justify-center py-7">
                <div class="
                    items-center rounded overflow-hidden shadow-lg 
                    group-hover/global:slide-up slide-out 
                    group-hover/global:flex
                ">
                    <!-- Control buttons -->
                    <button class="
                        group/btn 
                        bg-gray-600 hover:bg-gray-500 
                        text-white px-3 py-3
                    ">
                        <img src="/icons/arrow.svg" class="
                            invert h-6 
                            group-hover/btn:scale-[1.75] 
                            scale-150
                        ">
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Main content -->
        <img :src="imageUrl" class="object-cover" />
    </div>
</template>
```

---

## Best Practices

### 1. Positioning Strategy
```css
/* Always use positioning hierarchy */
relative        /* Parent container */
absolute        /* Overlay/positioned children */
fixed           /* Modals, full-screen overlays */
sticky          /* Headers, navigation */

/* Z-index scale */
z-10           /* Standard overlays */
z-20           /* Priority overlays */
z-50           /* Modals */
```

### 2. Responsive Design
```css
/* Mobile-first approach */
class="base-mobile-class md:tablet-class lg:desktop-class xl:wide-class"

/* Grid breakpoints */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Column spanning */
col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4
```

### 3. Group Hover Patterns
```vue
<!-- Named groups for nested hover states -->
<div class="group/global">
    <div class="group-hover/global:block">...</div>
    
    <div class="group/btn">
        <div class="group-hover/btn:scale-[1.1]">...</div>
    </div>
</div>
```

### 4. Conditional Classes
```vue
<!-- Use object syntax for complex conditions -->
<div 
    class="base-classes"
    :class="{
        'active-class': isActive,
        'selected-class': isSelected && !isDisabled,
        'error-class': hasError
    }"
>
```

### 5. Event Handling
```vue
<script setup>
import Utils from '@/utils';

const handleClick = (e) => {
    Utils.Prevent(e); // Prevent default behavior
    // Handle event
};
</script>

<template>
    <div 
        @click="handleClick"
        @drop="handleDrop"
        @dragover="Utils.Prevent"
    >
```

### 6. Component Communication
```vue
<script setup>
// Parent component
const emits = defineEmits(['eventName']);

// Emit events
emits('eventName', payload);

// Expose methods for parent ref access
defineExpose({
    publicMethod: () => {},
    publicProperty: someRef
});
</script>

<template>
    <!-- Child component -->
    <ChildComponent 
        @eventName="handleEvent"
        :ref="el => childRef = el"
    />
</template>
```

### 7. Image Loading Pattern
```vue
<script setup>
import Utils from '@/utils';

// Use utility for image URL construction
const imageUrl = Utils.ImageUrl(imageKey);
</script>

<template>
    <img 
        :src="Utils.ImageUrl(asset.image.key)" 
        class="object-cover w-full h-full"
    />
</template>
```

### 8. State Management
```vue
<script setup>
import { useStoreReactive } from '@/store';

// Use reactive stores for cached data
const store = useStoreReactive("unique-key");

if(!store || !store.loaded) {
    // Load data
    Object.assign(store, loadedData);
} else {
    // Use cached data
    Object.assign(localData, store);
}
</script>
```

### 9. Loading States
```vue
<script setup>
const state = reactive({
    loading: false,
    loaded: false
});

const loadData = async () => {
    state.loading = true;
    try {
        // Load data
        state.loaded = true;
    } finally {
        state.loading = false;
    }
};
</script>

<template>
    <div v-if="state.loading">Loading...</div>
    <div v-else-if="state.loaded">Content</div>
</template>
```

### 10. Accessibility Considerations
```vue
<template>
    <!-- Use semantic HTML -->
    <button type="button" @click="action">Action</button>
    
    <!-- Prevent click interference on icons -->
    <img src="..." class="pointer-events-none" />
    
    <!-- Keyboard navigation -->
    <div @keypress="handleKeyPress">...</div>
    
    <!-- Proper link usage -->
    <Link :href="route('name')">Link</Link>
</template>
```

---

## Component Checklist

When creating a new component, ensure:

- [ ] Props are properly typed with defaults
- [ ] Events are declared in `defineEmits`
- [ ] Color scheme follows the palette (gray-700/800/900)
- [ ] Hover states use appropriate classes
- [ ] Icons use `pointer-events-none` and `invert`
- [ ] Responsive classes are applied where needed
- [ ] Transitions are smooth (duration-500)
- [ ] Groups are properly named for nested hovers
- [ ] Images use `object-cover w-full h-full`
- [ ] Z-index hierarchy is maintained
- [ ] Event handlers prevent defaults when needed
- [ ] Loading/error states are handled
- [ ] Component exposes necessary methods via `defineExpose`

---

## Quick Reference

### Common Class Combinations

```css
/* Button */
bg-gray-700 hover:bg-blue-600 text-white px-4 py-2 rounded shadow

/* Icon Button */
bg-gray-900/75 p-1 rounded flex items-center justify-center

/* Card Container */
relative object-cover w-full h-full group bg-gray-800

/* Overlay */
absolute top-0 bottom-0 left-0 right-0 bg-transparent

/* Sidebar */
sticky top-0 bottom-0 h-full bg-gray-900 border-r border-gray-800 w-96 overflow-auto

/* Grid Layout */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center

/* Flex Center */
flex items-center justify-center

/* Hidden on Mobile, Show on Hover */
hidden group-hover:block

/* Text with Count */
<p>{{ name }}<span class="ml-1 text-gray-500">({{ count }})</span></p>
```