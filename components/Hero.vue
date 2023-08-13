<template>
  <div class="grid grid-cols-[100px_1fr_100px] p-2">
    <div></div>
    <div class="text-center">
      <span
        class="text-md text-white drop-shadow-[2.5px_2.5px_2px_rgba(0,0,0,1)]"
        >Journal /
      </span>
      <span
        class="text-md font-semibold text-white drop-shadow-[2.5px_2.5px_2px_rgba(0,0,0,1)]"
        data-testid="current-journal-date"
        >{{ getFormattedDate() }}</span
      >
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
