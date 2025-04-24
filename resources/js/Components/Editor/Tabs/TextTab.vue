<script setup>

</script>

<template>
  <div v-if="activeTab === 'text'" class="flex items-center space-x-2 flex-wrap">
    <button 
      @click="editor.chain().focus().toggleBold().run()" 
      class="p-1 rounded hover:bg-gray-100"
      :class="{ 'bg-gray-200': editor.isActive('bold') }"
      title="Bold"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 12h8a4 4 0 0 0 0-8H6v8z"></path>
        <path d="M6 12h9a4 4 0 0 1 0 8H6v-8z"></path>
      </svg>
    </button>

    <button 
      @click="editor.chain().focus().toggleItalic().run()" 
      class="p-1 rounded hover:bg-gray-100"
      :class="{ 'bg-gray-200': editor.isActive('italic') }"
      title="Italic"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 4h-9v2h3.5l-3.5 8h-3v2h9v-2h-3.5l3.5-8h3z"></path>
      </svg>
    </button>

    <button 
      @click="editor.chain().focus().toggleUnderline().run()" 
      class="p-1 rounded hover:bg-gray-100"
      :class="{ 'bg-gray-200': editor.isActive('underline') }"
      title="Underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 4v6a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4"></path>
        <line x1="4" y1="20" x2="20" y2="20"></line>
      </svg>
    </button>

    <button 
      @click="editor.chain().focus().toggleStrike().run()" 
      class="p-1 rounded hover:bg-gray-100"
      :class="{ 'bg-gray-200': editor.isActive('strike') }"
      title="Strikethrough"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17 9V5H7v4"></path>
        <path d="M16 15v4H8v-4"></path>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <button 
      @click="editor.chain().focus().toggleHighlight().run()" 
      class="p-1 rounded hover:bg-gray-100"
      :class="{ 'bg-gray-200': editor.isActive('highlight') }"
      title="Highlight"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12.5 7.5L10 12l3.5 4.5M5 15l2.5-5L5 5m14 10l-2.5-5L19 5"></path>
      </svg>
    </button>

    <button 
      @click="setLink" 
      class="p-1 rounded hover:bg-gray-100"
      :class="{ 'bg-gray-200': editor.isActive('link') }"
      title="Add Link"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    </button>

    <div class="flex items-center space-x-1">
      <label class="text-sm text-gray-600">Color:</label>
      <input 
        type="color" 
        @input="setColor" 
        :value="editor?.getAttributes('textStyle').color"
        class="w-8 h-8 p-0 border-none cursor-pointer"
        title="Text Color"
      />
    </div>

    <button 
      @click="editor.chain().focus().clearNodes().run()" 
      class="p-1 rounded hover:bg-gray-100"
      title="Clear Formatting"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        <line x1="2" y1="2" x2="22" y2="22"></line>
      </svg>
    </button>
</div>
</template>