<script setup>
import { TrashIcon } from "@heroicons/vue/24/outline";
import AlertDialog from "./AlertDialog";

const toast = useToast();

const journalContent = reactive({
  lexical: "",
  html: "",
});

const isAlertDialogOpen = ref(false);

const saveJournal = () => {
  // return if there is no text in editor
  if (!journalContent?.html?.length) {
    return;
  }

  if (props.currentJournal?.id) {
    updateJournal();
  } else {
    createJournal();
  }
};

const createJournal = async () => {
  const response = await $fetch("/api/journal", {
    method: "POST",
    body: {
      journalDate: props.currentJournal?.journalDate,
      html: journalContent.html,
      lexical: journalContent.lexical,
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to save journal",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  props.selectJournal(response);
  props.journalUpdated();
};

const updateJournal = async () => {
  const response = await $fetch("/api/journal/update", {
    params: {
      id: props.currentJournal?.id,
    },
    method: "POST",
    body: {
      html: journalContent.html,
      lexical: journalContent.lexical,
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to update journal",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  props.journalUpdated();
};

const deleteJournal = async () => {
  const response = await $fetch("/api/journal", {
    method: "DELETE",
    params: {
      id: props.currentJournal?.id,
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to delete journal",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  isAlertDialogOpen.value = false;
  props.selectJournal({
    journalDate: props.currentJournal.journalDate,
  });
  props.journalUpdated(response);
};

const onChange = (content) => {
  journalContent.html = content.html;
  journalContent.lexical = content.lexical;
};
const props = defineProps({
  currentJournal: Object,
  journalUpdated: Function,
  selectJournal: Function,
});

const onCancelDialog = () => {
  isAlertDialogOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-end gap-4 px-8 pt-8">
      <button
        class="px-1 py-1 text-sm font-medium text-stone-300 hover:text-red-300"
        @click="isAlertDialogOpen = true"
        title="Remove journal"
        v-if="props.currentJournal?.id"
      >
        <TrashIcon class="h-5 w-5" />
      </button>

      <button
        class="rounded border border-stone-500 px-3 py-1 text-sm font-medium text-stone-500 hover:border-stone-400"
        @click="saveJournal"
      >
        Save
      </button>
    </div>

    <AlertDialog
      :isOpen="isAlertDialogOpen"
      :onCancel="onCancelDialog"
      :onConfirm="deleteJournal"
    >
      <template #header> Are you absolutely sure? </template>

      <template #body>
        This action cannot be undone and will permanently remove your journal.
      </template>

      <template #action-text> Yes, delete journal </template>
    </AlertDialog>

    <LexicalEditor
      :value="currentJournal?.lexical"
      @onChange="onChange"
      :key="currentJournal"
    />
  </div>
</template>
