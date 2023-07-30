<script setup>
import { inject } from "vue";
import { parseISO, differenceInDays } from "date-fns";
// use inject here as we need this function in the lexical decorator component.
// Decorators use JS classes, and passing Vue function to it is difficult.
const getMilestonesList = inject("getMilestonesList");
const toast = useToast();

const STATUSES = {
  TODO: "TODO",
  DONE: "DONE",
};

const updateTaskStatus = (isChecked) => {
  $fetch("/api/task/update", {
    method: "POST",
    params: {
      id: props.id,
    },
    body: {
      status: isChecked ? STATUSES.DONE : STATUSES.TODO,
    },
  })
    .then((response) => {
      props.onChange?.({
        description: response?.description,
        checked: response?.status === STATUSES.DONE,
        dueDate: response?.dueDate,
      });
      getMilestonesList();
    })
    .catch((error) => {
      toast.add({
        title: "Fail to change task status",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

const handleChange = (checked) => {
  updateTaskStatus(checked);
};

const daysUntilDue = (dueDate) => {
  if (!dueDate) {
    return "";
  }
  const now = new Date();
  const due = parseISO(dueDate);
  const daysLeft = differenceInDays(due, now);

  if (daysLeft < 0) {
    return "past due";
  } else if (daysLeft === 0) {
    return "due today";
  } else {
    return `due in ${daysLeft} days`;
  }
};

const props = defineProps({
  id: Number,
  checked: Boolean,
  dueDate: [String, Boolean],
  onChange: Function,
  description: String,
});
</script>

<template>
  <div class="flex items-center justify-between">
    <UCheckbox
      :modelValue="checked"
      @update:modelValue="
        (newValue) => {
          handleChange(newValue);
        }
      "
      :name="`task-${id}`"
      :label="description"
      :help="daysUntilDue(dueDate)"
      :ui="{ help: 'text-xs' }"
    />
  </div>
</template>
