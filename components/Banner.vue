<template>
  <div
    class="basis-[35%] items-center bg-gray-900 bg-cover bg-center"
    v-bind:style="{ backgroundImage: 'url(' + banner?.link + ')' }"
  >
    <!-- Hero -->
    <div class="h-[15%] bg-gradient-to-b from-black/60 to-black/0 text-center">
      <Hero :date="currentJournal?.journalDate" />
    </div>
    <!-- Quote -->
    <div class="flex h-[70%] w-full items-center justify-center">
      <div class="w-2/3 rounded-lg">
        <span
          class="m-2 block pb-4 text-center text-3xl font-extralight leading-normal text-slate-100 drop-shadow-[2.5px_2.5px_2px_rgba(0,0,0,1)]"
        >
          {{ quote?.quote }}
        </span>
        <span
          class="m-2 block text-right text-lg text-slate-100 drop-shadow-[2.5px_2.5px_2px_rgba(0,0,0,1)]"
        >
          – {{ quote?.author }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <MoodSelector
        class="mb-2 ml-2 w-[224px] pt-2"
        :currentJournal="currentJournal"
        :selectJournal="selectJournal"
      />
      <!-- Information button -->
      <div
        class="group relative float-right flex h-[15%] items-center p-1 drop-shadow-[1px_1px_2px_rgba(0,0,0)] hover:bg-black/[.5]"
      >
        <div class="invisible text-white group-hover:visible">
          <p class="text-right text-xs">{{ banner?.reference }}</p>
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
  </div>
</template>

<script setup>
import { _backgroundImage } from "#tailwind-config/theme";

const props = defineProps({
  currentJournal: Object,
  selectJournal: Function,
});

const banner = ref(null);
const quote = ref(null);

// selects an image based on the day
const getImg = async () => {
  $fetch("/api/banner/random").then((response) => {
    banner.value = response;
  });
};

// it can be adjusted to select a quote based on mood
// selects a quote based on the day
const getQuote = async () => {
  $fetch("/api/quote/random").then((response) => {
    quote.value = response;
  });
};

onMounted(() => {
  getImg();
  getQuote();
});

watch(
  () => props.currentJournal,
  () => {
    getImg();
    getQuote();
  }
);
</script>
