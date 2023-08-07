<template>
  <div class="grid grid-cols-[100px_1fr_100px] p-3">
    <div></div>
    <div class="text-center">
      <span class="text-slate-300 text-lg font-bold">Journal / </span>
      <span class="text-slate-300 text-lg font-semibold" data-testid="current-journal-date">{{ getFormattedDate() }}</span>
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
