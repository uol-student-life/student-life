<script setup>
import { computed } from "vue";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  getDate,
  endOfDay,
} from "date-fns";
const daysCaption = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const handleClick = (day) => {
  if (journalsMap.value.has(getDate(day))) {
    props?.selectJournal(journalsMap.value.get(getDate(day)));
    return;
  }

  props?.selectJournal({ journalDate: endOfDay(day) });
};

// map journals to days, so it will be easier to show them on calendar
const journalsMap = computed(function () {
  const map = new Map();

  props?.journals?.forEach((journal) => {
    map.set(getDate(new Date(journal.journalDate)), journal);
  });

  return map;
});

const daysInMonth = computed(() => {
  const period = props.selectedPeriod
    ? new Date(props.selectedPeriod)
    : new Date();

  const startOfCurrentMonth = startOfMonth(period);
  const endOfCurrentMonth = endOfMonth(new Date(period));

  return eachDayOfInterval({
    start: startOfWeek(startOfCurrentMonth),
    end: endOfWeek(endOfCurrentMonth),
  });
});

const hasJournal = (day) => {
  return (
    isSameMonth(day, props.selectedPeriod) &&
    journalsMap.value.has(getDate(day))
  );
};

const props = defineProps({
  journals: Array,
  selectJournal: Function,
  selectedPeriod: Date,
});
</script>

<template>
  <div class="px-4">
    <div>
      <div class="grid grid-cols-7 place-items-center">
        <div
          class="px-2 py-2 text-xs font-normal text-stone-400"
          v-for="day in daysCaption"
          :key="day"
        >
          {{ day.toUpperCase() }}
        </div>
      </div>

      <div class="grid grid-cols-7 place-items-center">
        <div
          class="cursor-pointer text-sm"
          v-for="day in daysInMonth"
          :key="day"
        >
          <button
            class="relative min-w-[32px] p-2"
            :class="{
              'cursor-default text-stone-300': !isSameMonth(
                day,
                props.selectedPeriod
              ),
              'text-stone-600': isSameMonth(day, props.selectedPeriod),
            }"
            @click="isSameMonth(day, props.selectedPeriod) && handleClick(day)"
            data-test-day-button
          >
            {{ format(day, "d") }}
            <span
              class="absolute bottom-[2px] left-[50%] translate-x-[-50%]"
              v-if="isSameMonth(day, props.selectedPeriod) && hasJournal(day)"
            >
              <span
                class="block h-[6px] w-[6px] rounded-[50%] bg-stone-400"
                data-testid="has-journal"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
