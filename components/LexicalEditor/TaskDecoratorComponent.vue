<script setup>
import { onMounted } from "vue";

const STATUSES = {
  TODO: "TODO",
  DONE: "DONE",
};
const toast = useToast();
const description = ref(null);
const checked = ref(false);

const getTaskDescriptionById = (id) => {
  $fetch("/api/task", {
    params: {
      id,
    },
  })
    .then((response) => {
      description.value = response?.description;
      checked.value = response?.status === STATUSES.DONE;
    })
    .catch((error) => {
      toast.add({
        title: "Fail to fetch task description",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

onMounted(() => {
  getTaskDescriptionById(props.id);
});

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
      description.value = response?.description;
      checked.value = response?.status === STATUSES.DONE;
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

const handleChange = (event) => {
  if (event?.target) {
    updateTaskStatus(event.target.checked);
  }
};

const props = defineProps({
  id: Number,
});
</script>

<template>
  <div class="my-4">
    <UCheckbox
      :modelValue="checked"
      @update:modelValue="
        (newValue) => {
          handleChange(newValue);
          return (checked = newValue);
        }
      "
      :label="description"
      @change="handleChange"
    />
  </div>
</template>
