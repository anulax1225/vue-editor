<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Tabs from './Tabs.vue'

// Props and emits
const props = defineProps({
  initialContent: {
    type: String,
    default: `
        <h2>
        Présentation du groupe
        </h2>
        <img
        src="https://i0.wp.com/scoutne.ch/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-11-a-18.26.02_9f725e77.jpg?resize=1024%2C768&amp;ssl=1">
        <p>
        Notre groupe compte aujourd’hui près de 40 membres. Ils et elles sont réparti·es répartis dans quatre différentes branches :
        </p>
        <ul>
        <li>
            <b>Branche Louveteaux (7 – 11 ans) :</b>
            <p>
              Dès 7 ans, un enfant peut participer à nos activités en tant que louveteaux ou louvette. Réparti·es en sizaines formant ainsi une meute, les louveteaux et les louvettes découvrent le scoutisme à travers l’histoire du livre de la jungle et réalisent des jeux, bricolages ou autres activités adaptées à leur âge.  
            </p>
        </li>
        <li>
           <b>Branche Eclais (11 – 15 ans) :</b>
            <p>
              A partir de 11 ans, les jeunes de notre groupe font partie de la branche éclais. Ils et elles sont séparé·es en patrouilles qui forment une troupe. Durant les activités préparées et encadrées par les responsables, ils et elles apprennent à devenir autonome en approfondissant certains domaines comme les techniques de corde, topographie, cuisine, etc.
              Les plus grand·es éclais ont également la possibilité d’organiser eux·elles-mêmes des activités ou même des petits camps pour leurs patrouilles. Les responsables sont là pour leur expliquer comment planifier ces activités et encadrer des enfants plus jeunes.
            </p>
        </li>
        </ul>
        <p>
          Envie de faire découvrir le scoutisme à votre enfant ? Pas de problème! Il est possible de rejoindre notre groupe à n’importe quel moment de l’année.
          Il suffit de venir à nos locaux durant l’une de nos activités. Nous recommandons aux enfants de venir essayer nos activités pendant plusieurs séances avant de décider s’il souhaite s’inscrire au groupe ou non.
          N’hésitez pas à nous contacter si vous souhaitez avoir plus d’informations concernant notre groupe ou nos séances.
        </p>
    `
  }
})

const emit = defineEmits(['update'])

// Editor instance
const editor = ref(null)
const activeTab = ref('text')

const commonColors = [
  '#000000', '#343a40', '#495057', '#6c757d', '#adb5bd', '#ced4da', '#dee2e6', '#e9ecef', '#f8f9fa', '#ffffff',
  '#c92a2a', '#a61e4d', '#862e9c', '#5f3dc4', '#364fc7', '#1864ab', '#0b7285', '#087f5b', '#2b8a3e', '#5c940d',
  '#e67700', '#d9480f'
]

// Initialize editor
onMounted(() => {
  editor.value = new Editor({
    content: props.initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] }
      }),
      Underline,
      Highlight.configure({
        multicolor: true
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true
      }),
      Placeholder.configure({
        placeholder: 'Texte...'
      }),
      Typography,
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableCell,
      TableHeader
    ],
    onUpdate: ({ editor }) => {
      emit('update', {
        html: editor.getHTML(),
        json: editor.getJSON()
      })
    }
  })
  emit('update', {
    html: editor.value.getHTML(),
    json: editor.value.getJSON()
  })
})

// Clean up
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})



// Alignment methods
const setTextAlign = (align) => {
  editor.value.chain().focus().setTextAlign(align).run()
}

// Editor methods
// Editor methods
const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('Enter the URL', previousUrl)
  
  if (url === null) {
    return
  }

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const removeLink = () => {
  editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
}

const setColor = (color) => {
  editor.value.chain().focus().setColor(color).run()
}

const addImage = () => {
  const url = window.prompt('Enter image URL')
  if (url) {
    editor.value
      .chain()
      .focus()
      .setImage({ src: url })
      .run()
  }
}

const addTable = () => {
  editor.value
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}

const isTableActive = () => {
  return editor.value && (
    editor.value.isActive('table') ||
    editor.value.isActive('tableRow') ||
    editor.value.isActive('tableCell') ||
    editor.value.isActive('tableHeader')
  )
}

// Table operations
const addColumnBefore = () => {
  editor.value.chain().focus().addColumnBefore().run()
}

const addColumnAfter = () => {
  editor.value.chain().focus().addColumnAfter().run()
}

const deleteColumn = () => {
  editor.value.chain().focus().deleteColumn().run()
}

const addRowBefore = () => {
  editor.value.chain().focus().addRowBefore().run()
}

const addRowAfter = () => {
  editor.value.chain().focus().addRowAfter().run()
}

const deleteRow = () => {
  editor.value.chain().focus().deleteRow().run()
}

const deleteTable = () => {
  editor.value.chain().focus().deleteTable().run()
}

const toggleHeaderColumn = () => {
  editor.value.chain().focus().toggleHeaderColumn().run()
}

const toggleHeaderRow = () => {
  editor.value.chain().focus().toggleHeaderRow().run()
}

const mergeCells = () => {
  editor.value.chain().focus().mergeCells().run()
}

const splitCell = () => {
  editor.value.chain().focus().splitCell().run()
}

// List operations
const sinkListItem = () => {
  editor.value.chain().focus().sinkListItem('listItem').run()
}

const liftListItem = () => {
  editor.value.chain().focus().liftListItem('listItem').run()
}

// Public method to clear content
const clearContent = () => {
  editor.value.commands.clearContent()
}

// Undo/Redo
const undo = () => {
  editor.value.chain().focus().undo().run()
}

const redo = () => {
  editor.value.chain().focus().redo().run()
}

// Expose methods to parent components
defineExpose({
  clearContent
})

</script>
<template>
    <div class="notion-editor-container relative">
    <Tabs @active="(tab) => activeTab = tab"/>

    <!-- Toolbar based on active tab -->
    <div v-if="editor" class="bg-white border-b border-gray-200 p-2 flex space-x-2 flex-wrap">
      <!-- Text Formatting Tab -->
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

       <!-- Alignment Tab (New) -->
       <div v-if="activeTab === 'alignment'" class="flex items-center space-x-2 flex-wrap">
        <button 
          @click="setTextAlign('left')" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive({ textAlign: 'left' }) }"
          title="Align Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="17" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        
        <button 
          @click="setTextAlign('center')" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive({ textAlign: 'center' }) }"
          title="Align Center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="10" x2="6" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        
        <button 
          @click="setTextAlign('right')" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive({ textAlign: 'right' }) }"
          title="Align Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="21" y1="10" x2="7" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>
        
        <button 
          @click="setTextAlign('justify')" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive({ textAlign: 'justify' }) }"
          title="Justify"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="21" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        
        <div class="border-l border-gray-300 h-8 mx-2"></div>
        
        <p class="text-sm text-gray-600">
          Tip: Select text blocks or images before applying alignment.
        </p>
      </div>

      <!-- Block Elements Tab -->
      <div v-if="activeTab === 'blocks'" class="flex items-center space-x-2 flex-wrap">
        <button 
          @click="editor.chain().focus().setParagraph().run()" 
          class="px-2 py-1 text-sm rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('paragraph') }"
          title="Paragraph"
        >
          <span class="font-medium">¶</span>
        </button>
        
        <button 
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" 
          class="px-2 py-1 text-sm rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 1 }) }"
          title="Heading 1"
        >
          <span class="font-medium">H1</span>
        </button>
        
        <button 
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" 
          class="px-2 py-1 text-sm rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
          title="Heading 2"
        >
          <span class="font-medium">H2</span>
        </button>
        
        <button 
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" 
          class="px-2 py-1 text-sm rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 3 }) }"
          title="Heading 3"
        >
          <span class="font-medium">H3</span>
        </button>

        <button 
          @click="editor.chain().focus().toggleBlockquote().run()" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('blockquote') }"
          title="Blockquote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <button 
          @click="editor.chain().focus().setHorizontalRule().run()" 
          class="p-1 rounded hover:bg-gray-100"
          title="Horizontal Rule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <button 
          @click="editor.chain().focus().toggleCodeBlock().run()" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('codeBlock') }"
          title="Code Block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
      </div>

      <!-- Lists Tab -->
      <div v-if="activeTab === 'lists'" class="flex items-center space-x-2 flex-wrap">
        <button 
          @click="editor.chain().focus().toggleBulletList().run()" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        
        <button 
          @click="editor.chain().focus().toggleOrderedList().run()" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
        
        <button 
          @click="editor.chain().focus().toggleTaskList().run()" 
          class="p-1 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('taskList') }"
          title="Task List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="5" width="6" height="6" rx="1"></rect>
            <path d="M3 17h6"></path>
            <path d="M13 5h8"></path>
            <path d="M13 11h8"></path>
            <path d="M13 17h8"></path>
          </svg>
        </button>
        
        <button 
          @click="sinkListItem" 
          class="p-1 rounded hover:bg-gray-100"
          title="Indent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 8h13"></path>
            <path d="M17 8l4 4-4 4"></path>
            <path d="M3 16h13"></path>
          </svg>
        </button>
        
        <button 
          @click="liftListItem" 
          class="p-1 rounded hover:bg-gray-100"
          title="Outdent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 8H8"></path>
            <path d="M7 12H3l4-4-4-4"></path>
            <path d="M21 16H8"></path>
          </svg>
        </button>
      </div>
    <!-- Media Tab -->
    <div v-if="activeTab === 'media'" class="flex items-center space-x-2 flex-wrap">
        <button 
          @click="setLink" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          :class="{ 'bg-gray-200': editor.isActive('link') }"
          title="Add Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span class="ml-1 text-sm">Link</span>
        </button>

        <button 
          @click="addImage" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          title="Add Image from URL"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span class="ml-1 text-sm">URL Image</span>
        </button>

        <label class="p-1 rounded hover:bg-gray-100 flex items-center cursor-pointer" title="Upload Image">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
            <line x1="16" y1="5" x2="22" y2="5"></line>
            <line x1="19" y1="2" x2="19" y2="8"></line>
            <rect x="3" y="10" width="18" height="12" rx="2"></rect>
            <circle cx="8.5" cy="15.5" r="1.5"></circle>
            <polyline points="21 18 16 13 8 21"></polyline>
          </svg>
          <span class="ml-1 text-sm">Upload</span>
          <input 
            type="file" 
            @change="uploadImage" 
            accept="image/*" 
            class="hidden"
          />
        </label>

        <button 
          @click="editor.chain().focus().setHorizontalRule().run()" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          title="Horizontal Rule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span class="ml-1 text-sm">Divider</span>
        </button>

        <button 
          @click="editor.chain().focus().toggleCodeBlock().run()" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          :class="{ 'bg-gray-200': editor.isActive('codeBlock') }"
          title="Code Block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span class="ml-1 text-sm">Code</span>
        </button>
      </div>

      <!-- Tables Tab -->
      <div v-if="activeTab === 'tables'" class="flex items-center space-x-2 flex-wrap">
        <button 
          @click="addTable" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          title="Insert Table"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
          <span class="ml-1 text-sm">New Table</span>
        </button>
        
        <div class="border-r border-gray-300 h-6 mx-1"></div>
        
        <button 
          @click="addColumnBefore" 
          class="p-1 rounded hover:bg-gray-100"
          title="Add Column Before"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="6" y1="12" x2="12" y2="12"></line>
            <line x1="9" y1="9" x2="9" y2="15"></line>
          </svg>
        </button>
        
        <button 
          @click="addColumnAfter" 
          class="p-1 rounded hover:bg-gray-100"
          title="Add Column After"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="12" y1="12" x2="18" y2="12"></line>
            <line x1="15" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
        
        <button 
          @click="deleteColumn" 
          class="p-1 rounded hover:bg-gray-100"
          title="Delete Column"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="12" y1="9" x2="12" y2="15"></line>
          </svg>
        </button>
        
        <div class="border-r border-gray-300 h-6 mx-1"></div>
        
        <button 
          @click="addRowBefore" 
          class="p-1 rounded hover:bg-gray-100"
          title="Add Row Before"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="12" y1="6" x2="12" y2="12"></line>
            <line x1="9" y1="9" x2="15" y2="9"></line>
          </svg>
        </button>
        
        <button 
          @click="addRowAfter" 
          class="p-1 rounded hover:bg-gray-100"
          title="Add Row After"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="12" y1="12" x2="12" y2="18"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </button>
        
        <button 
          @click="deleteRow" 
          class="p-1 rounded hover:bg-gray-100"
          title="Delete Row"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="12" y1="12" x2="12" y2="12"></line>
          </svg>
        </button>
        
        <div class="border-r border-gray-300 h-6 mx-1"></div>
        
        <button 
          @click="toggleHeaderRow" 
          class="p-1 rounded hover:bg-gray-100"
          title="Toggle Header Row"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <path d="M6 6h12"></path>
          </svg>
        </button>
        
        <button 
          @click="toggleHeaderColumn" 
          class="p-1 rounded hover:bg-gray-100"
          title="Toggle Header Column"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <path d="M6 6v12"></path>
          </svg>
        </button>
        
        <div class="border-r border-gray-300 h-6 mx-1"></div>
        
        <button 
          @click="mergeCells" 
          class="p-1 rounded hover:bg-gray-100"
          title="Merge Cells"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21" stroke-dasharray="4"></line>
          </svg>
        </button>
        
        <button 
          @click="splitCell" 
          class="p-1 rounded hover:bg-gray-100"
          title="Split Cell"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </button>
        
        <div class="border-r border-gray-300 h-6 mx-1"></div>
        
        <button 
          @click="deleteTable" 
          class="p-1 rounded hover:bg-gray-100"
          title="Delete Table"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="flex items-center space-x-2 flex-wrap">
        <button 
          @click="undo" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          title="Undo"
          :disabled="!editor.can().undo()"
          :class="{ 'opacity-50 cursor-not-allowed': !editor.can().undo() }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6"></path>
          </svg>
          <span class="ml-1 text-sm">Undo</span>
        </button>
        
        <button 
          @click="redo" 
          class="p-1 rounded hover:bg-gray-100 flex items-center"
          title="Redo"
          :disabled="!editor.can().redo()"
          :class="{ 'opacity-50 cursor-not-allowed': !editor.can().redo() }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6"></path>
          </svg>
          <span class="ml-1 text-sm">Redo</span>
        </button>
        
        <div class="border-r border-gray-300 h-6 mx-1"></div>
        
        <button 
          @click="clearContent" 
          class="p-1 rounded hover:bg-gray-100 flex items-center text-red-500"
          title="Clear Content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
          <span class="ml-1 text-sm">Clear All</span>
        </button>
      </div>
    </div>
      <!-- Bubble Menu for Inline Formatting -->
      <bubble-menu 
      v-if="editor" 
      :editor="editor"
      :tippy-options="{ duration: 100, placement: 'bottom' }"
      class="z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-2 flex-wrap"
    >
      <div class="flex items-center space-x-1 p-1">
        <!-- Text Formatting Buttons -->
        <button 
          @click="editor.chain().focus().toggleBold().run()" 
          class="p-1.5 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('bold') }"
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 12h8a4 4 0 0 0 0-8H6v8z"></path>
            <path d="M6 12h9a4 4 0 0 1 0 8H6v-8z"></path>
          </svg>
        </button>

        <button 
          @click="editor.chain().focus().toggleItalic().run()" 
          class="p-1.5 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('italic') }"
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>

        <button 
          @click="editor.chain().focus().toggleUnderline().run()" 
          class="p-1.5 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('underline') }"
          title="Underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 4v6a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4"></path>
            <line x1="4" y1="20" x2="20" y2="20"></line>
          </svg>
        </button>

        <button 
          @click="editor.chain().focus().toggleStrike().run()" 
          class="p-1.5 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('strike') }"
          title="Strikethrough"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <path d="M16 6l-4 4-4-4"></path>
            <path d="M8 18l4-4 4 4"></path>
          </svg>
        </button>

        <button 
          @click="editor.chain().focus().toggleHighlight().run()" 
          class="p-1.5 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200': editor.isActive('highlight') }"
          title="Highlight"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            <rect x="9" y="9" width="6" height="6" fill="currentColor"></rect>
          </svg>
        </button>

        <div class="h-5 w-px bg-gray-300 mx-1"></div>

        <!-- Link Buttons -->
        <button 
          v-if="!editor.isActive('link')"
          @click="setLink" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Add Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>

        <div v-if="editor.isActive('link')" class="flex space-x-1">
          <button 
            @click="setLink" 
            class="p-1.5 rounded hover:bg-gray-100 bg-gray-200"
            title="Edit Link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>
          <button 
            @click="removeLink" 
            class="p-1.5 rounded hover:bg-gray-100"
            title="Remove Link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              <line x1="2" y1="2" x2="22" y2="22"></line>
            </svg>
          </button>
        </div>

        <div class="h-5 w-px bg-gray-300 mx-1"></div>

        <!-- Color Dropdown -->
        <div class="relative group">
          <button 
            class="p-1.5 rounded hover:bg-gray-100 flex items-center"
            title="Text Color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L18 11H6L12 2Z" fill="currentColor"></path>
              <line x1="5" y1="19" x2="19" y2="19"></line>
            </svg>
          </button>
          <div class="absolute hidden group-hover:grid grid-cols-6 gap-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48 top-full left-0 mt-1">
            <button 
              v-for="color in commonColors" 
              :key="color"
              @click="setColor(color)"
              class="w-6 h-6 rounded-full border border-gray-300"
              :style="{ backgroundColor: color }"
              :title="color"
            ></button>
          </div>
        </div>

        <div class="h-5 w-px bg-gray-300 mx-1"></div>

        <!-- Clear formatting -->
        <button 
          @click="editor.chain().focus().unsetAllMarks().run()" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Clear Formatting"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l-7-7 7-7"></path>
            <path d="M19 19V5"></path>
          </svg>
        </button>
      </div>

      <!-- Show table menu if table is active -->
      <div v-if="isTableActive()" class="flex items-center space-x-1 border-l border-gray-300 pl-2">
        <button 
          @click="addColumnBefore" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Add Column Before"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <path d="M6 12h6"></path>
            <path d="M9 9v6"></path>
          </svg>
        </button>
        
        <button 
          @click="addColumnAfter" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Add Column After"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <path d="M12 12h6"></path>
            <path d="M15 9v6"></path>
          </svg>
        </button>
        
        <button 
          @click="addRowBefore" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Add Row Before"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <path d="M12 6v6"></path>
            <path d="M9 9h6"></path>
          </svg>
        </button>
        
        <button 
          @click="addRowAfter" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Add Row After"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <path d="M12 12v6"></path>
            <path d="M9 15h6"></path>
          </svg>
        </button>
        
        <div class="h-5 w-px bg-gray-300 mx-1"></div>
        
        <button 
          @click="deleteRow" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Delete Row"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </button>
        
        <button 
          @click="deleteColumn" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Delete Column"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
        
        <button 
          @click="mergeCells" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Merge Cells"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <rect x="9" y="9" width="6" height="6" fill="currentColor" opacity="0.2"></rect>
          </svg>
        </button>
        
        <button 
          @click="splitCell" 
          class="p-1.5 rounded hover:bg-gray-100"
          title="Split Cell"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M12 3v18"></path>
            <path d="M3 12h18"></path>
          </svg>
        </button>
      </div>
    </bubble-menu>

    <!-- Floating Menu for Block Types -->
    <floating-menu 
      v-if="editor" 
      :editor="editor"
      :tippy-options="{ duration: 100, placement: 'bottom-start' }"
      class="z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col space-y-1 min-w-[200px]"
    >
      <button 
        @click="editor.chain().focus().setParagraph().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('paragraph') }"
      >
        <span class="mr-2">¶</span>
        <span>Paragraph</span>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('heading', { level: 1 }) }"
      >
        <span class="mr-2 font-bold text-lg">H1</span>
        <span>Heading 1</span>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('heading', { level: 2 }) }"
      >
        <span class="mr-2 font-bold">H2</span>
        <span>Heading 2</span>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('heading', { level: 3 }) }"
      >
        <span class="mr-2 font-bold text-sm">H3</span>
        <span>Heading 3</span>
      </button>
      
      <div class="h-px bg-gray-200 my-1"></div>
      
      <button 
        @click="editor.chain().focus().toggleBulletList().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('bulletList') }"
      >
        <span class="mr-2">•</span>
        <span>Bullet List</span>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleOrderedList().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('orderedList') }"
      >
        <span class="mr-2">1.</span>
        <span>Numbered List</span>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleTaskList().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('taskList') }"
      >
        <span class="mr-2">☑️</span>
        <span>Task List</span>
      </button>
      
      <div class="h-px bg-gray-200 my-1"></div>
      
      <button 
        @click="editor.chain().focus().toggleBlockquote().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('blockquote') }"
      >
        <span class="mr-2">"</span>
        <span>Quote</span>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleCodeBlock().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
        :class="{ 'bg-gray-100': editor.isActive('codeBlock') }"
      >
        <span class="mr-2">{"}</span>
        <span>Code Block</span>
      </button>
      
      <div class="h-px bg-gray-200 my-1"></div>
      
      <button 
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
      >
        <span class="mr-2">—</span>
        <span>Horizontal Rule</span>
      </button>
      
      <button 
        @click="addTable"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
      >
        <span class="mr-2">⊞</span>
        <span>Table</span>
      </button>
      
      <button 
        @click="addImage"
        class="flex items-center px-3 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
      >
        <span class="mr-2">🖼️</span>
        <span>Image</span>
      </button>
    </floating-menu>
  
      <!-- Editor Content -->
      <editor-content 
      :editor="editor" 
      class="tiptap-editor"
      :class="'prose prose-sm sm:prose-base lg:prose-lg prose-blue p-5 min-h-[500px]'"
    />
    </div>
  </template>
  
  
<style>
</style>