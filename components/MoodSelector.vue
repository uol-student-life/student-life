<script setup>
import { watch, computed } from "vue";
import Relaxed from "./MoodIcons/Relaxed";
import Motivated from "./MoodIcons/Motivated";
import Depressed from "./MoodIcons/Depressed";
import Stressed from "./MoodIcons/Stressed";

const toast = useToast();
const currentMoodId = ref(props?.currentJournal?.mood);

const mood = [
  {
    id: "MOTIVATED",
    label: "Motivated",
    moodIcon: Motivated,
  },
  {
    id: "RELAXED",
    label: "Relaxed",
    moodIcon: Relaxed,
  },
  {
    id: "STRESS",
    label: "Stressed",
    moodIcon: Stressed,
  },
  {
    id: "DEPRESSED",
    label: "Depressed",
    moodIcon: Depressed,
  },
];

const setMoodToJournal = async () => {
  const response = await $fetch("/api/journal/update", {
    method: "POST",
    params: {
      id: props.currentJournal.id,
    },
    body: {
      mood: currentMoodId.value,
    },
  }).catch((error) => {
    toast.add({
      title: `Fail to update mood`,
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  return response;
};

async function createJournalWithMood() {
  const response = await $fetch("/api/journal", {
    method: "POST",
    body: {
      journalDate: props.currentJournal.journalDate,
      mood: currentMoodId.value,
      html: "",
      lexical: "",
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to add journal with mood",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  return response;
}

const setMood = async (value) => {
  currentMoodId.value = value.id;
  if (props.currentJournal.id) {
    const updatedJournal = await setMoodToJournal();
    props.selectJournal(updatedJournal);
  } else {
    const newJournal = await createJournalWithMood();
    props.selectJournal(newJournal);
  }
};

watch(
  () => props.currentJournal,
  () => {
    currentMoodId.value = props.currentJournal.mood;
  }
);

const currentMood = computed(() =>
  mood.find((item) => item.id === currentMoodId.value)
);

const props = defineProps({
  currentJournal: Object,
  selectJournal: Function,
});
</script>
<template>
  <div data-testid="mood-selector">
    <USelectMenu
      modelValue="currentMoodId"
      @update:modelValue="
        (newValue) => {
          setMood(newValue);
        }
      "
      :options="mood"
      value-attribute="id"
    >
      <template #label>
        <div v-if="currentMood" class="flex items-center gap-2">
          <component :is="currentMood?.moodIcon" class="h-5 w-5" />
          {{ currentMood?.label }}
        </div>

        <span v-else>How are you feeling today?</span>
      </template>
    </USelectMenu>
  </div>
</template>
