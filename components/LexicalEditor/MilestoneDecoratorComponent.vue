<script setup>
import { onMounted } from "vue";
import { StarIcon } from "@heroicons/vue/24/outline";

const toast = useToast();
const description = ref(null);

const getMilestoneDescriptionById = (id) => {
  $fetch("/api/milestone", {
    params: {
      id,
    },
  })
    .then((response) => {
      description.value = response?.description;
    })
    .catch((error) => {
      toast.add({
        title: "Fail to fetch milestone",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

onMounted(() => {
  getMilestoneDescriptionById(props.id);
});

const props = defineProps({
  id: Number,
});
</script>

<template>
  <UBadge color="orange" variant="solid">
    <StarIcon class="mr-1 h-4 w-4" />
    <span>{{ description }}</span>
  </UBadge>
</template>
