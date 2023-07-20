<script setup>
import AlertDialog from "./AlertDialog";
import { debounce } from "lodash";
import { onUnmounted } from "vue";

const toast = useToast();

const journalContent = reactive({
  lexical: "",
  html: "",
});

const isAlertDialogOpen = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

const saveJournal = async () => {
  if (props.currentJournal?.id) {
    await updateJournal();
  } else {
    await createJournal();
  }
};

const debouncedSaveJournal = debounce(saveJournal, 1000);

onUnmounted(() => {
  debouncedSaveJournal.cancel();
});

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
      props.selectJournal(response);
    })
    .catch((error) => {
      toast.add({
        title: "Fail to save journal",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
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

  debouncedSaveJournal();
};
const props = defineProps({
  currentJournal: Object,
  journalUpdated: Function,
  selectJournal: Function,
  milestoneUpdated: Function,
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
      :currentJournal="currentJournal"
      :milestoneUpdated="milestoneUpdated"
    />
  </div>
</template>
