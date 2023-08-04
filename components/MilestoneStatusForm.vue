<script setup>
import { onMounted } from "vue";
const status = ref("");
const toast = useToast();

const STATUSES = [
  {
    label: "In progress",
    value: "INPROGRESS",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
];

const updateStatus = async (id) => {
  const response = await $fetch("/api/milestone/update", {
    method: "POST",
    params: {
      id,
    },
    body: {
      status: status.value,
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to update milestone",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  return response;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  await updateStatus(props.id);
  props.onSubmit?.();
};

onMounted(() => {
  if (props.status) {
    status.value = props.status;
  }
});

const onFormClick = (e) => {
  // prevent Slideover component opening while editing milestone
  e.stopPropagation();
};

const props = defineProps({
  id: Number,
  status: String,
  onSubmit: Function,
});
</script>

<template>
  <form @submit="handleSubmit" @click="onFormClick">
    <div class="align-center flex justify-between gap-4 p-6">
      <USelect
        v-model="status"
        :options="STATUSES"
        option-attribute="label"
        value-attribute="value"
        color="gray"
        variant="outline"
        placeholder="Select milestone status"
      />
      <UButton color="gray" type="submit" :disabled="!status">
        Update status
      </UButton>
    </div>
  </form>
</template>
