<template>
  <div class="grid grid-cols-[100px_1fr_100px] p-2">
    <div></div>
    <div class="text-center">
      <span class="text-white text-md font-semibold drop-shadow-[2px_2px_4px_rgba(0,0,0)]">Journal / </span>
      <span class="text-white text-md font-semibold drop-shadow-[2px_2px_4px_rgba(0,0,0)]" data-testid="current-journal-date">{{ getFormattedDate() }}</span>
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
