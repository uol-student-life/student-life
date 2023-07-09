<script setup>
const editorInitialValue =
  '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Some initial text","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

function onChange(journalContent) {
  console.log(journalContent.html); // html, will need it for journals list view
  console.log(journalContent.lexical); // lexical state
}
</script>

<template>
  <LexicalEditor :value="editorInitialValue" @onChange="onChange" />
</template>
