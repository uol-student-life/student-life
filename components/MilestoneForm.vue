<script setup>
import { onMounted } from "vue";
const description = ref("");
const toast = useToast();
const isLoading = ref(false);

const createMilestone = async () => {
  if (!description.value) {
    return;
  }

  isLoading.value = true;
  const response = await $fetch("/api/milestone", {
    method: "POST",
    body: {
      description: description.value,
    },
  })
    .catch((error) => {
      toast.add({
        title: "Fail to create milestone",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => (isLoading.value = false));

  return response;
};

const updateMilestone = async (id) => {
  isLoading.value = true;
  const response = await $fetch("/api/milestone/update", {
    method: "POST",
    params: {
      id,
    },
    body: {
      description: description.value,
    },
  })
    .catch((error) => {
      toast.add({
        title: "Fail to update milestone",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => (isLoading.value = false));

  return response;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const milestone = props.id
    ? await updateMilestone(props.id)
    : await createMilestone();
  if (milestone) {
    props.onSubmit?.(milestone);
  }
};

onMounted(() => {
  if (props.description) {
    description.value = props.description;
  }
});

const onFormClick = (e) => {
  // prevent Slideover component opening while editing milestone
  e.stopPropagation();
};

const props = defineProps({
  id: Number,
  description: String,
  onSubmit: Function,
});
</script>

<template>
  <form
    @submit="handleSubmit"
    @click="onFormClick"
    data-testid="milestone-form"
  >
    <div class="align-center flex justify-between gap-4 p-6">
      <UInput
        v-model="description"
        type="milestone"
        color="gray"
        placeholder="Milestone description"
      />
      <UButton color="gray" type="submit" :loading="isLoading">
        <span v-if="props.id">Update milestone</span>
        <span v-else>Add milestone</span>
      </UButton>
    </div>
  </form>
</template>
