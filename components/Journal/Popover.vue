<script setup lang="ts">
import { computed } from "vue";
import { DatePicker as VCalendarDatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
  selectJournal: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["update:model-value", "close"]);
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const toast = useToast();

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:model-value", value);
  },
});

const addJournal = async (event: Event) => {
  event.preventDefault();

  const journal = await getJournalByDate(date.value);
  if (journal) {
    props.selectJournal(journal);
  } else {
    const journal = await createJournalByDate(date.value);
    props.selectJournal(journal);
  }

  emit("close");
};

async function createJournalByDate(date: Date) {
  const response = await $fetch("/api/journal", {
    method: "POST",
    body: {
      journalDate: date.toString(),
      html: "",
      lexical: "",
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to add journal",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  return response;
}

async function getJournalByDate(date: Date) {
  const response = await $fetch("/api/journal", {
    params: {
      journalDate: date.toISOString(),
    },
  }).catch((error) => {
    if (error.status !== 404) {
      toast.add({
        title: "Fail to add journal",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    }
  });

  return response;
}

const attrs = [
  {
    key: "today",
    highlight: {
      color: "gray",
      fillMode: "outline",
      class: "!bg-gray-100 dark:!bg-gray-800",
    },
    dates: new Date(),
  },
];
</script>

<template>
  <VCalendarDatePicker
    v-model="date"
    transparent
    borderless
    :attributes="attrs"
    :is-dark="isDark"
    title-position="left"
    trim-weeks
    :first-day-of-week="2"
    :popover="{ placement: 'bottom' }"
  >
    <template #default="{ inputValue, inputEvents }">
      <form @submit="addJournal" data-testid="journal-creation-form">
        <div class="align-center flex justify-between gap-4 p-6">
          <UInput color="gray" :value="inputValue" v-on="inputEvents" />

          <UButton color="gray" type="submit"> Add journal </UButton>
        </div>
      </form>
    </template>
  </VCalendarDatePicker>
</template>
