<script setup>
const props = defineProps({
  isOpen: Boolean,
  onCancel: Function,
  onConfirm: Function,
  confirmColor: {
    type: String,
    default: "primary",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <UModal
    :model-value="isOpen"
    @update:model-value="(val) => !val && props.onCancel()"
  >
    <UCard>
      <template #header>
        <span class="font-medium text-stone-500">
          <slot name="header"></slot>
        </span>
      </template>
      <slot name="body"></slot>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton color="gray" variant="outline" @click="onCancel">
            Cancel
          </UButton>

          <UButton :color="confirmColor" @click="onConfirm" :loading="loading">
            <slot name="action-text"></slot>
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
