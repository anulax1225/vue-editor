<script setup>
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-markup'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import { computed, onMounted, onUpdated, watch, ref } from 'vue';
import { html as beautifyHtml } from 'js-beautify'

const props = defineProps({
    code: {
        type: String,
        default: ""
    }
})

const codeBlock = ref(null);

const beautifiedCode = computed(() =>
  beautifyHtml(props.code, {
    indent_size: 4,
    wrap_line_length: 80,
  })
)
const highlighted = computed(() => Prism.highlight(beautifiedCode.value, Prism.languages.markup, 'markup'))

onMounted(() => {
  if (codeBlock.value) {
    codeBlock.value.textContent = beautifiedCode.value
    Prism.highlightElement(codeBlock.value)
  }
})

onUpdated(() => {
  if (codeBlock.value) {
    codeBlock.value.textContent = beautifiedCode.value
    Prism.highlightElement(codeBlock.value)
  }
})
</script>

<template>
      <pre class="">
        <code ref="codeBlock" class="language-markup">
        </code>
      </pre>
</template>

<style>

</style>
