<template>
  <Section title="Journal">
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
      <div class="font-semibold text-stone-400">date</div>
      <!-- back and forward arrows here -->
      <div>arrows</div>
    </div>
    <!-- tabs content -->
    <div v-if="openTab == 1">
      <JournalList
        :journals="journals"
        :selectJournal="selectJournal"
        :currentJournal="currentJournal"
      />
    </div>
    <div v-if="openTab == 2">
      <JournalCalendar />
    </div>
  </Section>
</template>

<script setup>
// import icons
import { CalendarIcon } from "@heroicons/vue/24/outline";
import { Bars4Icon } from "@heroicons/vue/24/outline";

// tab icons
const openTab = ref(1);
const toggleTabs = (tab) => {
  if (openTab.value !== tab) {
    openTab.value = tab;
  }
};

const props = defineProps({
  journals: Array,
  selectJournal: Function,
  currentJournal: Object,
});
</script>
