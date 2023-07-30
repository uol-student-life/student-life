<script setup>
import { computed, onMounted } from "vue";
import { DatePicker as VCalendarDatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const toast = useToast();

const milestonesList = ref([]);
const description = ref("");
const dueDate = ref(new Date().toISOString());
const milestone = ref(null);

const createTask = async () => {
  const response = await $fetch("/api/task", {
    method: "POST",
    body: {
      description: description.value,
      dueDate: dueDate.value,
      journalId: props?.journalId || null,
      milestoneId: milestone.value,
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to save task",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  return response;
};

const getMilestones = async () => {
  const response = await $fetch("/api/milestones", {
    method: "POST",
  }).catch((error) => {
    toast.add({
      title: "Fail to get milestones",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  if (response) {
    milestonesList.value = response;
  }
};

onMounted(() => {
  getMilestones();
});

const handleSubmit = async (event) => {
  event.preventDefault();

  const task = await createTask();
  if (task) {
    props.onTaskSubmit?.(task);
  }
};

const props = defineProps({
  options: Array,
  journalId: Number,
  onTaskSubmit: Function,
});

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
  <form @submit="handleSubmit" class="min-w-[300px]">
    <div class="align-center grid grid-cols-1 gap-4 bg-stone-50 p-6">
      <USelect
        v-model="milestone"
        :options="milestonesList"
        option-attribute="description"
        value-attribute="id"
        color="gray"
        variant="outline"
        placeholder="Select Milestone"
      />
      <UTextarea
        v-model="description"
        color="gray"
        placeholder="New Task"
        autoresize
      />
      <VCalendarDatePicker
        v-model="dueDate"
        mode="dateTime"
        is24hr
        transparent
        borderless
        :attributes="attrs"
        :is-dark="isDark"
        title-position="left"
        trim-weeks
        :first-day-of-week="2"
        :popover="{ placement: 'bottom', visibility: 'click' }"
      >
        <template #default="{ inputValue, inputEvents }">
          <div class="max-w-[150px]">
            <UInput
              color="gray"
              :value="inputValue"
              v-on="inputEvents"
              placeholder="Date"
            />
          </div>
        </template>
      </VCalendarDatePicker>
      <div class="flex w-full justify-center">
        <UButton
          color="blue"
          variant="outline"
          class="w-full justify-center bg-slate-400 p-3 text-center text-gray-50 hover:bg-slate-500 disabled:text-stone-300"
          type="submit"
          :disabled="!description || !milestone"
        >
          Add Task
        </UButton>
      </div>
    </div>
  </form>
</template>
