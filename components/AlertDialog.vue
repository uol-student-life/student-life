<script setup>
const props = defineProps({
  isOpen: Boolean,
  onCancel: Function,
  onConfirm: Function,
});
</script>

<template>
  <UModal
    :model-value="isOpen"
    @update:model-value="(val) => !val && props.onCancel()"
  >
    <div class="bg-stone-50 p-8 text-stone-700">
      <h1 class="mb-4 font-medium">
        <slot name="header"></slot>
      </h1>

      <p class="font-light">
        <slot name="body"></slot>
      </p>

      <div class="flex justify-end gap-6 pt-6">
        <button
          class="rounded bg-stone-100 px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200"
          @click="onCancel"
        >
          Cancel
        </button>

        <button
          class="rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          @click="onConfirm"
        >
          <slot name="action-text"></slot>
        </button>
      </div>
    </div>
  </UModal>
</template>
