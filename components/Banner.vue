<template>
    <div  class="basis-2/5 h-5 items-center bg-center" v-bind:style="{ backgroundImage:'url(' + getImg() + ')' }">
        <div class="bg-black/[.35]">
            <Hero :date="currentJournal?.journalDate" />
        </div>
        <div class="h-4/5 w-full p-4 flex items-center justify-center">
            <div class="w-2/3 rounded-lg bg-black/[.35]">
                <h2 class="m-6 text-xl text-center font-bold text-slate-300">{{ getQuote()[1] }}</h2>
                <p class="m-6 text-md text-right font-bold text-slate-300">{{ getQuote()[0] }}</p>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { _backgroundImage } from "#tailwind-config/theme";
    import bannerImages from "../static/images.json" 
    import bannerQuotes from "../static/quotes.json" 

    const day = new Date().getDate();

    const getImg = () => {
        return bannerImages[day - 1]['link']
    }

    const getQuote = () => {
        return [bannerQuotes[day - 1]['autor'], bannerQuotes[day - 1]['quote']]
    }

    const props = defineProps({
        currentJournal: Object,
    });
    
</script>
