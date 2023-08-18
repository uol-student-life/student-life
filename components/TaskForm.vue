<script setup>
import { computed, onMounted } from "vue";
import { DatePicker as VCalendarDatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const toast = useToast();

const milestonesList = ref([]);
const description = ref("");
const noDueDate = ref(true);
const dueDate = ref(null);
const milestone = ref(null);
const isSaving = ref(false);
const isLoadingMilestones = ref(false);

whenever(
  () => noDueDate.value,
  () => {
    dueDate.value = null;
  }
);

const createTask = async () => {
  isSaving.value = true;
  const response = await $fetch("/api/task", {
    method: "POST",
    body: {
      description: description.value,
      dueDate: noDueDate.value ? null : dueDate.value,
      journalId: props?.journalId || null,
      milestoneId: milestone.value,
    },
  })
    .catch((error) => {
      toast.add({
        title: "Fail to save task",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => (isSaving.value = false));

  return response;
};

const updateTask = async (id) => {
  isSaving.value = true;
  const response = await $fetch("/api/task/update", {
    method: "POST",
    params: {
      id,
    },
    body: {
      description: description.value,
      dueDate: noDueDate.value ? null : dueDate.value,
      journalId: props?.journalId || null,
      milestoneId: milestone.value,
    },
  })
    .catch((error) => {
      toast.add({
        title: "Fail to update task",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => (isSaving.value = false));

  return response;
};

const getMilestones = async () => {
  isLoadingMilestones.value = true;
  const response = await $fetch("/api/milestones", {
    method: "POST",
  })
    .catch((error) => {
      toast.add({
        title: "Fail to get milestones",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => (isLoadingMilestones.value = false));

  if (response) {
    milestonesList.value = response;
  }
};

const getTaskDataById = (id) => {
  $fetch("/api/task", {
    params: {
      id,
    },
  })
    .then((response) => {
      description.value = response?.description;
      dueDate.value = response?.dueDate;
      if (dueDate.value) {
        noDueDate.value = false;
      } else {
        noDueDate.value = true;
      }
      milestone.value = response?.milestone.id;
    })
    .catch((error) => {
      toast.add({
        title: "Fail to fetch task info",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

onMounted(() => {
  getMilestones();
  if (props.id) {
    getTaskDataById(props.id);
  }
});

const handleSubmit = async (event) => {
  event.preventDefault();

  const task = props.id ? await updateTask(props.id) : await createTask();
  if (task) {
    props.onTaskSubmit?.(task);
  }
};

const props = defineProps({
  journalId: Number,
  onTaskSubmit: Function,
  id: Number,
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
  <form @submit="handleSubmit" class="min-w-[300px]" data-testid="task-form">
    <div class="align-center grid grid-cols-1 gap-4 bg-stone-50 p-6">
      <USelect
        v-model="milestone"
        :options="milestonesList"
        option-attribute="description"
        value-attribute="id"
        color="gray"
        variant="outline"
        placeholder="Select Milestone"
        :disabled="!milestonesList.length"
        :loading="isLoadingMilestones"
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
              :disabled="noDueDate"
            />
          </div>
          <UCheckbox v-model="noDueDate" label="No Due Date" />
        </template>
      </VCalendarDatePicker>
      <div class="flex w-full justify-center">
        <UButton
          color="blue"
          variant="outline"
          class="w-full justify-center bg-slate-400 p-3 text-center text-gray-50 hover:bg-slate-500 disabled:text-stone-300"
          type="submit"
          :disabled="!description || !milestone"
          :loading="isSaving"
        >
          <span v-if="props.id">Update task</span>
          <span v-else>Add task</span>
        </UButton>
      </div>
    </div>
  </form>
</template>
