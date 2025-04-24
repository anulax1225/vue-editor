<script setup>
import { ref } from 'vue';

const emits = defineEmits(["active"])

// Set active tab
const setActiveTab = (tab) => {
  emits('active', tab)
}
</script>

<template>
    <!-- Tab Menu -->
    <div class="flex border-b border-gray-200 mb-1">
      <button 
        @click="setActiveTab('text')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        Text Formatting
      </button>
      <button 
        @click="setActiveTab('alignment')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'alignment' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        Alignment
      </button>
      <button 
        @click="setActiveTab('blocks')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'blocks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        Block Elements
      </button>
      <button 
        @click="setActiveTab('lists')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'lists' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        Lists
      </button>
      <button 
        @click="setActiveTab('tables')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'tables' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        Tables
      </button>
      <button 
        @click="setActiveTab('media')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'media' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        Media
      </button>
      <button 
        @click="setActiveTab('history')" 
        class="px-4 py-2 font-medium text-sm"
        :class="activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'">
        History
      </button>
    </div>
</template>