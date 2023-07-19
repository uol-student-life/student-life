<script setup>
import { onMounted, onBeforeMount } from "vue";
import { isSameDay, getMonth, getYear, subMonths, addMonths } from "date-fns";

// Let's keep it light mode for now.
const colorMode = useColorMode();
onBeforeMount(() => {
  colorMode.preference = "light";
});

const toast = useToast();

const journals = ref([]);
const currentJournal = ref(null);
const selectedMonthYear = ref({
  month: getMonth(new Date()),
  year: getYear(new Date()),
});

const getJournalsList = async ({ showWelcomeMessage } = {}) => {
  await $fetch("/api/journals", {
    params: {
      month: selectedMonthYear.value.month,
      year: selectedMonthYear.value.year,
    },
  })
    .then((response) => {
      journals.value = response;
      if (showWelcomeMessage) {
        toast.add({
          title: "Welcome Back!",
          description: "Your journals are ready to go.",
          color: "green",
          icon: "i-heroicons-check-badge",
        });
      }
    })
    .catch((error) => {
      toast.add({
        title: "Fail to fetch journals",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

const showPrevMonth = () => {
  const date = new Date(
    selectedMonthYear.value.year,
    selectedMonthYear.value.month
  );
  const prevDate = subMonths(date, 1);
  selectedMonthYear.value.month = getMonth(prevDate);
  selectedMonthYear.value.year = getYear(prevDate);
  getJournalsList();
};

const showNextMonth = () => {
  const date = new Date(
    selectedMonthYear.value.year,
    selectedMonthYear.value.month
  );
  const prevDate = addMonths(date, 1);
  selectedMonthYear.value.month = getMonth(prevDate);
  selectedMonthYear.value.year = getYear(prevDate);
  getJournalsList();
};

onMounted(async () => {
  await getJournalsList({ showWelcomeMessage: true });
  await setCurrentJournal();
});

const handleJournalSelection = async (journal) => {
  currentJournal.value = journal;
  await getJournalsList();
};

const setCurrentJournal = () => {
  const currentDate = new Date();
  const journal = journals.value?.find((journal) => {
    return isSameDay(new Date(journal.journalDate), currentDate);
  });

  if (journal) {
    currentJournal.value = journal;
  } else {
    currentJournal.value = {
      journalDate: new Date().toISOString(),
    };
  }
};

const getSelectedPeriod = () => {
  return new Date(selectedMonthYear.value.year, selectedMonthYear.value.month);
};
</script>

<template>
  <UNotifications />
  <div class="grid h-screen grid-rows-[minmax(0,_1fr)_auto] bg-neutral-50">
    <main
      class="grid grid-cols-[minmax(20%,_340px)_minmax(50%,_1fr)_minmax(20%,_340px)]"
    >
      <aside
        class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_300px)] overflow-hidden"
      >
        <Journal
          :journals="journals"
          :selectJournal="handleJournalSelection"
          :currentJournal="currentJournal"
          :showPrevMonth="showPrevMonth"
          :showNextMonth="showNextMonth"
          :selectedPeriod="getSelectedPeriod()"
        />
        <MoodTracker />
      </aside>

      <div class="overflow-auto border-x border-x-neutral-200">
        <Hero :date="currentJournal?.journalDate" />
        <ClientOnly>
          <Editor
            :currentJournal="currentJournal"
            :journalUpdated="getJournalsList"
            :selectJournal="handleJournalSelection"
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
