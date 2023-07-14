<script setup>
const journalContent = reactive({
  lexical: "",
  html: "",
});

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
  }).catch((error) => error.data.message); // todo: add toast component for notifications

  props.journalUpdated(response);
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
  }).catch((error) => error.data.message); // todo: add toast component for notifications

  props.journalUpdated();
};

const onChange = (content) => {
  journalContent.html = content.html;
  journalContent.lexical = content.lexical;
};
const props = defineProps({
  currentJournal: Object,
  journalUpdated: Function,
});
</script>

<template>
  <div>
    <div class="flex justify-end px-8 pt-8">
      <button
        class="rounded border border-stone-500 px-3 py-1 text-sm font-medium text-stone-500 hover:border-stone-400"
        @click="saveJournal"
      >
        Save
      </button>
    </div>
    <LexicalEditor
      :value="currentJournal?.lexical"
      @onChange="onChange"
      :key="currentJournal"
    />
  </div>
</template>
