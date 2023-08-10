<template>
  <div
    class="basis-[35%] items-center bg-center"
    v-bind:style="{ backgroundImage: 'url(' + getImg()[0] + ')' }"
  >
    <!-- Hero -->
    <div class="h-[15%] text-center backdrop-blur-2xl">
      <Hero :date="currentJournal?.journalDate" />
    </div>
    <!-- Quote -->
    <div class="flex h-[70%] w-full items-center justify-center">
      <div class="w-2/3 rounded-lg backdrop-blur-2xl">
        <h2
          class="m-2 text-center text-lg font-semibold text-slate-100 drop-shadow-[2px_2px_4px_rgba(0,0,0)]"
        >
          {{ getQuote()[1] }}
        </h2>
        <p
          class="text-md m-2 text-right font-semibold text-slate-100 drop-shadow-[2px_2px_4px_rgba(0,0,0)]"
        >
          {{ getQuote()[0] }}
        </p>
      </div>
    </div>
    <!-- Information button -->
    <div
      class="group relative float-right flex h-[15%] items-center p-1 drop-shadow-[1px_1px_2px_rgba(0,0,0)] hover:bg-black/[.5]"
    >
      <div class="invisible text-white group-hover:visible">
        <p class="text-right text-xs">{{ getImg()[1] }}</p>
        <p class="text-right text-xs">
          Quotes by <a href="https://www.brainyquote.com/">BrainyQuote</a>
        </p>
      </div>
      <UIcon
        name="i-heroicons-information-circle-20-solid"
        class="h-5 w-5 p-2 text-white"
      />
    </div>
  </div>
</template>

<script setup>
import { _backgroundImage } from "#tailwind-config/theme";
import bannerImages from "../static/images.json";
import bannerQuotes from "../static/quotes.json";

const props = defineProps({
  currentJournal: Object,
});

// selects an image based on the day
const getImg = () => {
  if (!props.currentJournal) {
    return [
      bannerImages[new Date().getDate() - 1]["link"],
      bannerImages[new Date().getDate() - 1]["reference"],
    ];
  }
  return [
    bannerImages[new Date(props.currentJournal.journalDate).getDate() - 1][
      "link"
    ],
    bannerImages[new Date(props.currentJournal.journalDate).getDate() - 1][
      "reference"
    ],
  ];
};

// it can be adjusted to select a quote based on mood
// selects a quote based on the day
const getQuote = () => {
  if (!props.currentJournal) {
    return [
      bannerQuotes[new Date().getDate() - 1]["author"],
      bannerQuotes[new Date().getDate() - 1]["quote"],
    ];
  }
  return [
    bannerQuotes[new Date(props.currentJournal.journalDate).getDate() - 1][
      "author"
    ],
    bannerQuotes[new Date(props.currentJournal.journalDate).getDate() - 1][
      "quote"
    ],
  ];
};
</script>
