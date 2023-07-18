<template>
  <Section title="Journal">
    <div
      class="grid h-full grid-rows-[auto_1fr] overflow-hidden"
      data-testid="journals"
    >
      <div
        class="mb-4 flex flex-row-reverse items-center justify-between gap-4 px-6"
      >
        <!--tabs -->
        <div class="flex rounded-lg bg-stone-50 p-0.5">
          <!-- menu icon-->
          <a href="#" v-on:click="toggleTabs(1)">
            <div
              class="rounded-md p-1"
              :class="{
                'border border-solid border-stone-400/0 bg-stone-300/0':
                  openTab !== 1,
                'border border-solid border-stone-400 bg-stone-200':
                  openTab === 1,
              }"
            >
              <Bars4Icon class="h-5 w-5 text-stone-700" />
            </div>
          </a>
          <!-- calendar icon -->
          <a href="#" class="ml-2" v-on:click="toggleTabs(2)">
            <div
              class="rounded-md p-1"
              :class="{
                'border border-transparent bg-stone-50': openTab !== 2,
                'border border-solid border-stone-400 bg-stone-200':
                  openTab === 2,
              }"
            >
              <CalendarIcon class="h-5 w-5 text-stone-700" />
            </div>
          </a>
        </div>
        <!-- current date here -->
        <div class="text-sm font-semibold text-stone-400">
          {{ getFormattedDate() }}
        </div>
        <!-- back and forward arrows here -->
        <div class="flex items-center">
          <button class="pr-2" @click="showPrevMonth">
            <ArrowLeftIcon
              class="max-w-4 h-4 text-stone-700 hover:text-stone-500"
            />
          </button>
          <button class="pl-2" @click="showNextMonth">
            <ArrowRightIcon
              class="max-w-4 h-4 text-stone-700 hover:text-stone-500"
            />
          </button>
        </div>
      </div>
      <!-- tabs content -->
      <div class="overflow-auto" v-if="openTab == 1">
        <JournalList
          :journals="journals"
          :selectJournal="selectJournal"
          :currentJournal="currentJournal"
        />
      </div>
      <div class="overflow-auto" v-if="openTab == 2">
        <JournalCalendar
          :journals="journals"
          :selectJournal="selectJournal"
          :selectedPeriod="selectedPeriod"
        />
      </div>
    </div>
  </Section>
</template>

<script setup>
// import icons
import {
  CalendarIcon,
  Bars4Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";
import { format } from "date-fns";

// tab icons
const openTab = ref(1);
const toggleTabs = (tab) => {
  if (openTab.value !== tab) {
    openTab.value = tab;
  }
};

const getFormattedDate = () => {
  if (!props.selectedPeriod) {
    return "";
  }

  return format(props.selectedPeriod, "MMMM, yyyy");
};

const props = defineProps({
  journals: Array,
  selectJournal: Function,
  currentJournal: Object,
  showPrevMonth: Function,
  showNextMonth: Function,
  selectedPeriod: Date,
});
</script>
