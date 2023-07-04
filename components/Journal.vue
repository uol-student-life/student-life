<template>
  <Section title="Journal" class="relative">
    <div class="flex">
      <!--tabs components-->
      <div class="absolute right-2 top-14 flex rounded-lg bg-stone-50 p-0.5">
        <!-- menu icon-->
        <a href="#" v-on:click="toggleTabs(1)">
          <div
            class="rounded-md p-1"
            :class="{
              'bg-stone-50': openTab !== 1,
              'border  border-solid border-stone-400 bg-stone-300':
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
              'bg-stone-50': openTab !== 2,
              'border  border-solid border-stone-400 bg-stone-300':
                openTab === 2,
            }"
          >
            <CalendarIcon class="h-5 w-5 text-stone-700" />
          </div>
        </a>
      </div>
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
</script>
