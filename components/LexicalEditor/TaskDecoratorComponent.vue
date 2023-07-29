<script setup>
import { onMounted } from "vue";

const STATUSES = {
  TODO: "TODO",
  DONE: "DONE",
};
const toast = useToast();
const description = ref(null);
const checked = ref(false);
const dueDate = ref(false);

const getTaskDescriptionById = (id) => {
  $fetch("/api/task", {
    params: {
      id,
    },
  })
    .then((response) => {
      description.value = response?.description;
      checked.value = response?.status === STATUSES.DONE;
      dueDate.value = response?.dueDate;
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

const handleChange = (data = {}) => {
  description.value = data.description;
  checked.value = data.checked;
  dueDate.value = data.dueDate;
};

const props = defineProps({
  id: Number,
});
</script>

<template>
  <div class="my-4">
    <Task
      :description="description"
      :id="id"
      :checked="checked"
      :onChange="handleChange"
      :dueDate="dueDate"
    />
  </div>
</template>
