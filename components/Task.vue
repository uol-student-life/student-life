<script setup>
import { inject } from "vue";
import { parseISO, differenceInDays } from "date-fns";
import { updatedTask } from "../stores/updatedTask";
import { removedTask } from "../stores/removedTask";
// use inject here as we need this function in the lexical decorator component.
// Decorators use JS classes, and passing Vue function to it is difficult.
const getMilestonesList = inject("getMilestonesList");
const toast = useToast();
const isAlertDialogOpen = ref(false);
const isDeleting = ref(false);

const STATUSES = {
  TODO: "TODO",
  DONE: "DONE",
};

const updateTaskStorage = ({ data }) => {
  // need this data to sync task state in editor and in tasks section
  updatedTask.id = props.id;
  updatedTask.checked = data?.status === STATUSES.DONE;
  updatedTask.description = data?.description;
  updatedTask.dueDate = data?.dueDate;
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
      getMilestonesList();
      updateTaskStorage({ data: response });
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

const onTaskUpdated = ({ data, close }) => {
  updateTaskStorage({ data });
  close();
  getMilestonesList();
};

const deleteTask = () => {
  isDeleting.value = true;

  $fetch("/api/task", {
    method: "DELETE",
    params: {
      id: props.id,
    },
  })
    .then(() => {
      getMilestonesList();
    })
    .catch((error) => {
      toast.add({
        title: "Fail to remove task",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => {
      isDeleting.value = false;
      isAlertDialogOpen.value = false;
      // need this to sync task state in editor and in tasks section
      removedTask.id = props.id;
    });
};

const onCancelDialog = () => {
  isAlertDialogOpen.value = false;
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

const onClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  isAlertDialogOpen.value = true;
};

const props = defineProps({
  id: Number,
  checked: Boolean,
  dueDate: [String, Boolean],
  description: String,
  hideActions: Boolean,
});
</script>

<template>
  <div class="group flex items-center justify-between gap-4">
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

    <div class="flex items-center justify-between" v-if="!props.hideActions">
      <UPopover :popper="{ placement: 'bottom' }">
        <UButton
          color="gray"
          icon="i-heroicons-pencil"
          variant="link"
          title="Edit task"
          size="xs"
          class="invisible opacity-50 hover:opacity-100 group-hover:visible"
        />

        <template #panel="{ close }">
          <TaskForm
            :onTaskSubmit="(data) => onTaskUpdated({ data, close })"
            :id="props.id"
          />
        </template>
      </UPopover>

      <UButton
        color="gray"
        icon="i-heroicons-trash"
        variant="link"
        size="xs"
        class="invisible opacity-50 hover:opacity-100 group-hover:visible"
        title="Remove task"
        @click="onClick"
      />
    </div>
  </div>

  <AlertDialog
    :isOpen="isAlertDialogOpen"
    :onCancel="onCancelDialog"
    :onConfirm="deleteTask"
    confirmColor="red"
    :loading="isDeleting"
  >
    <template #header> Are you absolutely sure? </template>

    <template #body>
      This action cannot be undone and will permanently remove your task.
    </template>

    <template #action-text> Yes, delete task </template>
  </AlertDialog>
</template>
