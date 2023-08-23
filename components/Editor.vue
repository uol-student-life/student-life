<script setup>
import AlertDialog from "./AlertDialog";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";
import { debounce } from "lodash";
import { onUnmounted } from "vue";
import { parseISO, format } from "date-fns";

const toast = useToast();

const journalContent = reactive({
  lexical: "",
  html: "",
});

const isAlertDialogOpen = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const journalUpdatedAt = ref(null);

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
      journalUpdatedAt.value = response.updatedAt;
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

  if (response) {
    journalUpdatedAt.value = response.updatedAt;
  }
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

const getJournalUpdatedDate = () => {
  if (!journalUpdatedAt) {
    return;
  }
  const dateObject = parseISO(journalUpdatedAt.value);
  return format(dateObject, "HH:mm:ss");
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-4 px-8 pt-8">
      
      <div class="text-sm text-stone-400">
        <div v-if="isSaving" class="flex items-center gap-2">
          <ArrowPathIcon class="h-4 w-4 animate-spin" /> Saving
        </div>
      </div>
      <div class="flex items-center justify-end gap-4">
        <div class="text-sm text-stone-400">
          <div v-if="journalUpdatedAt" class="flex items-center gap-2">
            <CheckCircleIcon class="h-4 w-4" /> Last updated on
            {{ getJournalUpdatedDate() }}
          </div>
        </div>
        
        <UButton
          v-if="props.currentJournal?.id"
          @click="isAlertDialogOpen = true"
          color="red"
          variant="outline"
          icon="i-heroicons-trash"
        >
          Delete
        </UButton>

        <!-- Information button -->
        <UPopover>
          <UIcon
            name="i-heroicons-question-mark-circle"
            class="h-5 w-5 p-2 text-stone-400"
          />
          <template #panel>
            <div class="text-xs text-stone-400 p-2 bg-stone-100 border-solid border border-stone-200">
              <p>To create milestones use: <b>#</b></p>
              <p>Text editor with basic <b>markdown</b> support</p>
            </div>
          </template>
        </UPopover>
      </div>
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
      :currentJournal="currentJournal"
      :milestoneUpdated="milestoneUpdated"
    />
  </div>
</template>
