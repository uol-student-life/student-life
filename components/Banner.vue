<template>
    <div  class="basis-2/5 h-5 items-center bg-center" v-bind:style="{ backgroundImage:'url(' + getImg()[0] + ')' }">
        <!-- Hero -->
        <div class="bg-black/[.35]">
            <Hero :date="currentJournal?.journalDate" />
        </div>
        <!-- Quote -->
        <div class="h-[70%] w-full flex items-center justify-center">
            <div class="w-2/3 rounded-lg bg-black/[.35]">
                <h2 class="m-6 text-xl text-center font-bold text-slate-100">{{ getQuote()[1] }}</h2>
                <p class="m-6 text-md text-right font-bold text-slate-100">{{ getQuote()[0] }}</p>
            </div>
        </div>
        <!-- Information button -->
        <div class="group relative flex float-right items-end p-2 hover:bg-black/[.5]">
            <div class="invisible group-hover:visible text-white">
                <p class="text-sm text-right">{{ getImg()[1] }}</p>
                <p class="text-sm text-right">Quotes by <a href="https://www.brainyquote.com/">BrainyQuote</a></p>
            </div>
            <UIcon
                name="i-heroicons-information-circle-20-solid"
                class="h-5 w-5 text-white" 
            />
        </div>
    </div>
</template>


<script setup>
    import { _backgroundImage } from "#tailwind-config/theme";
    import bannerImages from "../static/images.json" 
    import bannerQuotes from "../static/quotes.json" 

    const day = new Date().getDate();

    // selects an image based on the day
    const getImg = () => {
        return [bannerImages[day - 1]['link'], bannerImages[day - 1]['reference'], ]
    }

    // it can be adjusted to select a quote based on mood
    // selects a quote based on the day 
    const getQuote = () => {
        return [bannerQuotes[day - 1]['autor'], bannerQuotes[day - 1]['quote']]
    }

    const props = defineProps({
        currentJournal: Object,
    });
    
</script>
