<script setup>
import { TrashIcon } from "@heroicons/vue/24/outline";
import AlertDialog from "./AlertDialog";

const toast = useToast();

const journalContent = reactive({
  lexical: "",
  html: "",
});

const isAlertDialogOpen = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

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
    onRequest: () => {
      isSaving.value = true;
    },
    onResponse: () => {
      isSaving.value = false;
    },
    onRequestError: () => {
      isSaving.value = false;
    },
  })
    .then((response) => {
      toast.add({
        title: "Journal created",
        description: "Your journal has been created.",
        color: "green",
        icon: "i-heroicons-check-badge",
      });
    })
    .catch((error) => {
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
    onRequest: () => {
      isSaving.value = true;
    },
    onResponse: () => {
      isSaving.value = false;
    },
    onRequestError: () => {
      isSaving.value = false;
    },
  })
    .then((response) => {
      toast.add({
        title: "Journal saved",
        description: "Your journal has been saved.",
        color: "green",
        icon: "i-heroicons-check-badge",
      });
    })
    .catch((error) => {
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
    onRequest: () => {
      isDeleting.value = true;
    },
    onResponse: () => {
      isDeleting.value = false;
    },
    onRequestError: () => {
      isDeleting.value = false;
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
      <UButton
        v-if="props.currentJournal?.id"
        @click="isAlertDialogOpen = true"
        color="red"
        variant="outline"
        icon="i-heroicons-trash"
      >
        Delete
      </UButton>

      <UButton
        color="gray"
        @click="saveJournal"
        icon="i-heroicons-pencil-square"
        :loading="isSaving"
      >
        Save
      </UButton>
    </div>

    <AlertDialog
      :isOpen="isAlertDialogOpen"
      :onCancel="onCancelDialog"
      :onConfirm="deleteJournal"
      confirmColor="red"
      :loading="isDeleting"
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
