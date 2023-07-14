<script setup>
import { onMounted } from "vue";
import { isSameDay } from "date-fns";

const journals = ref([]);
const currentJournal = ref(null);

const getJournalsList = async () => {
  const response = await $fetch("/api/journals").catch(
    (error) => error.data.message
  ); // todo: add toast component for notifications;
  journals.value = response;
};

onMounted(async () => {
  await getJournalsList();
  await setCurrentJournal();
});

const handleJournalSelection = (journal) => {
  currentJournal.value = journal;
};

const setCurrentJournal = () => {
  const currentDate = new Date();
  currentJournal.value = journals.value.find((journal) => {
    return isSameDay(new Date(journal.journalDate), currentDate);
  });
};
</script>

<template>
  <div class="grid h-screen grid-rows-[minmax(0,_1fr)_auto] bg-neutral-50">
    <main class="grid grid-cols-[25%_50%_25%]">
      <aside
        class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_300px)] overflow-hidden"
      >
        <Journal
          :journals="journals"
          :selectJournal="handleJournalSelection"
          :currentJournal="currentJournal"
        />
        <MoodTracker />
      </aside>

      <div class="border-x border-x-neutral-200">
        <ClientOnly>
          <Editor
            :currentJournal="currentJournal"
            :journalUpdated="getJournalsList"
          />
        </ClientOnly>
      </div>

      <aside
        class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_1fr)] overflow-hidden"
      >
        <Milestones />
        <Tasks />
      </aside>
    </main>

    <footer class="border-t border-t-neutral-200 p-2 text-sm text-neutral-400">
      240 words
    </footer>
  </div>
</template>
