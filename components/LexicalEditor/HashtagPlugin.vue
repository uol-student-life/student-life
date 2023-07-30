<script setup>
import {
  COMMAND_PRIORITY_LOW,
  $getSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useEditor, LexicalHashtagPlugin, useMounted } from "lexical-vue";
import { $isHashtagNode } from "@lexical/hashtag";
import { useHashtag } from "./useHashtag";
import {
  getSelectedNode,
  showLexicalDropdown,
  hideHashtagDropdown,
} from "./utils";
import MilestonePlugin from "./MilestonePlugin";
import TaskPlugin from "./TaskPlugin";
import HashtagDropdown from "./HashtagDropdown";
import { debounce } from "lodash";
import { onUnmounted } from "vue";
import { HASHTAG_DROPDOWN_SELECTOR } from "./constants";

const toast = useToast();
const editor = useEditor();
const dropdownData = ref([]);

const getMilestonesByDescription = (description) => {
  return $fetch("/api/milestones", {
    method: "POST",
    body: {
      filters: {
        description,
      },
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to fetch milestones",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });
};

const getTasksByDescription = async (description) => {
  return $fetch("/api/tasks", {
    method: "POST",
    body: {
      filters: {
        description,
      },
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to fetch milestones",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });
};

const untagMilestone = async (id) => {
  hideHashtagDropdown();
  await $fetch("/api/milestone/untag", {
    method: "POST",
    params: {
      id,
    },
    body: {
      from: {
        journalId: props.currentJournal.id,
      },
    },
  });
};

const updateDropdownData = (description) => {
  Promise.all(
    [getMilestonesByDescription, getTasksByDescription].map((cb) =>
      cb(description)
    )
  ).then((result) => {
    dropdownData.value = [...result[0], ...result[1]];
  });
};

const debouncedUpdateDropdownData = debounce(updateDropdownData, 200);

onUnmounted(() => {
  debouncedUpdateDropdownData.cancel();
});

useHashtag(editor, untagMilestone);

useMounted(() => {
  return mergeRegister(
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        const selectedNode = getSelectedNode(selection);
        if ($isHashtagNode(selectedNode)) {
          const element = editor.getElementByKey(selectedNode.getKey());
          showLexicalDropdown(element, HASHTAG_DROPDOWN_SELECTOR);
          debouncedUpdateDropdownData(
            selectedNode.getTextContent().substring(1)
          );

          return true;
        }

        hideHashtagDropdown();

        return false;
      },
      COMMAND_PRIORITY_LOW
    )
  );
});

const props = defineProps({
  currentJournal: Object,
  milestoneUpdated: Function,
});
</script>

<template>
  <HashtagDropdown
    :milestoneUpdated="milestoneUpdated"
    :currentJournal="currentJournal"
    :editor="editor"
    :items="dropdownData"
  />
  <LexicalHashtagPlugin />
  <MilestonePlugin />
  <TaskPlugin
    :currentJournal="currentJournal"
    :milestoneUpdated="milestoneUpdated"
  />
</template>
