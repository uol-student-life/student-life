<template>
  <div class="grid grid-cols-[100px_1fr_100px] p-4">
    <div></div>
    <div class="text-center">
      <span class="text-stone-400">Journal / </span>
      <span data-testid="current-journal-date">{{ getFormattedDate() }}</span>
    </div>
  </div>
</template>
<script setup>
import { format } from "date-fns";
const props = defineProps({
  date: String,
});

const getFormattedDate = () => {
  if (!props.date) {
    return "";
  }
  return format(new Date(props.date), "do MMMM yyyy");
};
</script>
