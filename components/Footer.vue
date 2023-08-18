<script setup>
import pluralize from "pluralize";
import { wordCount } from "../stores/wordCount";

const props = defineProps({
  milestones: Number,
});
</script>
<template>
  <footer
    class="flex justify-end gap-8 border-t border-t-neutral-200 px-8 py-4 text-sm text-neutral-400"
  >
    <span v-if="wordCount">{{ pluralize("word", wordCount, true) }}</span>
    <span v-if="milestones">{{
      pluralize("milestone", milestones, true)
    }}</span>
  </footer>
</template>
