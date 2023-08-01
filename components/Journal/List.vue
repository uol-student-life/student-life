<template>
  <div>
    <ul>
      <li
        class="grid cursor-pointer grid-cols-[40px_1fr] items-center gap-4 px-6 py-2 text-sm hover:bg-stone-200"
        :class="{
          'bg-stone-200': journal.id === currentJournal?.id,
        }"
        v-for="journal in journals"
        :key="journal.id"
        @click="onClick(journal)"
      >
        <div
          class="flex h-[40px] w-[40px] items-center justify-center rounded bg-gradient-to-b from-stone-300 to-stone-200 text-center text-xl font-semibold"
        >
          {{ getJournalDay(journal.journalDate) }}
        </div>
        <div class="line-clamp-2">{{ stripHtml(journal.html) }}</div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { getDate, parseISO } from "date-fns";
const props = defineProps({
  journals: Array,
  currentJournal: Object,
  selectJournal: Function,
});

const onClick = (journal) => {
  props.selectJournal(journal);
};

const getJournalDay = (date) => {
  const dateISO = parseISO(date);
  return getDate(dateISO);
};
</script>
