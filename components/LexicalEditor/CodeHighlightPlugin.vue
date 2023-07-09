<!-- Taken from https://github.com/wobsoriano/lexical-vue/tree/main/playground-->

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { registerCodeHighlighting } from "@lexical/code";
import { useEditor } from "lexical-vue";

const editor = useEditor();
let unregisterListener: () => void;

onMounted(() => {
  unregisterListener = registerCodeHighlighting(editor);
});

onUnmounted(() => {
  unregisterListener?.();
});
</script>

<template />
