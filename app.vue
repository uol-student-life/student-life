<script setup>
import { onMounted, provide } from "vue";
import { isSameDay, getMonth, getYear, subMonths, addMonths } from "date-fns";
import Footer from "./components/Footer";

// Let's keep it light mode for now.
const colorMode = useColorMode();
onMounted(() => {
  colorMode.preference = "light";
});

const toast = useToast();

const journals = ref([]);
const milestones = ref([]);
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

const getMilestonesList = async () => {
  const response = await $fetch("/api/milestones", {
    method: "POST",
  }).catch((error) => {
    toast.add({
      title: "Fail to fetch milestones",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  milestones.value = response;
};

// use provide here as we need this function in the lexical decorator component.
// Decorators use JS classes, and passing Vue function to it is difficult.
provide("getMilestonesList", getMilestonesList);

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
  await getMilestonesList();
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
  <NuxtLoadingIndicator color="#78716c" :height="3" />
  <UNotifications />
  <div class="grid h-screen grid-rows-[minmax(0,_1fr)_auto] bg-neutral-50">
    <main
      class="grid grid-cols-[minmax(20%,_380px)_minmax(50%,_1fr)_minmax(20%,_380px)]"
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
        <MoodTracker :journals="journals" />
      </aside>

      <div class="flex flex-col overflow-auto border-x border-x-neutral-200">
        <Banner
          :currentJournal="currentJournal"
          :selectJournal="handleJournalSelection"
        />
        <ClientOnly>
          <Editor
            :currentJournal="currentJournal"
            :journalUpdated="getJournalsList"
            :milestoneUpdated="getMilestonesList"
            :selectJournal="handleJournalSelection"
            :key="currentJournal"
          />
        </ClientOnly>
      </div>

      <aside
        class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_1fr)] overflow-hidden"
      >
        <Milestones
          :milestones="milestones"
          :selectJournal="handleJournalSelection"
          :getMilestonesList="getMilestonesList"
        />
        <Tasks :milestones="milestones" :milestoneUpdated="getMilestonesList" />
      </aside>
    </main>

    <Footer :milestones="milestones?.length" />
  </div>
</template>
