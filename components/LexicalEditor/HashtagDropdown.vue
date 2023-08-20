<script setup>
import { $getSelection } from "lexical";
import { getSelectedNode } from "~/components/LexicalEditor/utils";
import {
  PlusIcon,
  StarIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
import { INSERT_MILESTONE_COMMAND } from "./MilestoneNode";
import { CREATE_TASK_COMMAND, INSERT_TASK_COMMAND } from "./TaskNode";
import { useEditor } from "lexical-vue";
import { hideHashtagDropdown } from "./utils";
import { HASHTAG_DROPDOWN_ID } from "./constants";
import { vOnClickOutside } from "@vueuse/components";

const editor = useEditor();
const toast = useToast();
const isCreatingMilestone = ref(false);

const createMilestone = async ({ name }) => {
  isCreatingMilestone.value = true;
  const response = await $fetch("/api/milestone", {
    method: "POST",
    body: {
      description: name,
      to: {
        journalId: props.currentJournal.id,
      },
    },
  })
    .catch((error) => {
      toast.add({
        title: "Fail to save milestone",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => (isCreatingMilestone.value = false));

  hideHashtagDropdown();
  if (response?.id) {
    props.milestoneUpdated();
    editor.dispatchCommand(INSERT_MILESTONE_COMMAND, {
      id: response?.id,
    });
  }
};

const tagMilestone = async ({ id }) => {
  editor.getEditorState().read(() => {
    editor.dispatchCommand(INSERT_MILESTONE_COMMAND, { id });
  });
  hideHashtagDropdown();
  const response = await $fetch("/api/milestone/tag", {
    method: "POST",
    params: {
      id,
    },
    body: {
      to: {
        journalId: props.currentJournal.id,
      },
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to tag milestone",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  if (response) {
    props.milestoneUpdated();
  }
};

const addMilestone = () => {
  editor.update(() => {
    const selection = $getSelection();
    const selectedNode = getSelectedNode(selection);

    createMilestone({ name: selectedNode.getTextContent().substring(1) });
  });
};

const addTask = () => {
  editor.dispatchCommand(CREATE_TASK_COMMAND, {});
};

const handleDropdownItemClick = (item) => {
  if (item.tasks) {
    tagMilestone({ id: item.id, description: item.description });
  } else {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      const selectedNode = getSelectedNode(selection);

      editor.dispatchCommand(INSERT_TASK_COMMAND, {
        id: item.id,
        replaceNode: selectedNode,
      });
    });
  }
};

const props = defineProps({
  milestoneUpdated: Function,
  currentJournal: Object,
  editor: Object,
  items: Array,
});
</script>

<template>
  <div
    class="z-50 hidden min-w-[300px] rounded bg-stone-100 p-1 text-base text-stone-700 shadow-md"
    :id="HASHTAG_DROPDOWN_ID"
    v-on-click-outside="hideHashtagDropdown"
  >
    <ul class="max-h-[300px] overflow-auto">
      <li class="cursor-pointer rounded hover:bg-stone-200">
        <button
          class="w-full px-2 py-1"
          @click="addMilestone"
          data-testid="editor-add-milestone"
          :disabled="isCreatingMilestone"
        >
          <div
            v-if="!isCreatingMilestone"
            class="flex w-full items-center gap-2"
          >
            <PlusIcon class="h-4 w-4" /> add milestone
          </div>

          <div v-else class="flex w-full items-center gap-2">
            <ArrowPathIcon class="h-4 w-4 animate-spin" /> adding milestone
          </div>
        </button>
      </li>

      <li
        class="cursor-pointer rounded hover:bg-stone-200"
        v-if="!isCreatingMilestone"
      >
        <button
          class="flex w-full items-center gap-2 px-2 py-1"
          @click="addTask"
          data-testid="editor-add-task"
        >
          <PlusIcon class="h-4 w-4" /> add task
        </button>
      </li>
      <li
        class="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 hover:bg-stone-200"
        v-for="item in items"
        v-if="!isCreatingMilestone"
        :key="item.id"
        @click="handleDropdownItemClick(item)"
      >
        <div class="flex items-center gap-2">
          <StarIcon class="h-4 w-4" v-if="item.tasks" />
          <CheckIcon class="h-4 w-4" v-if="!item.tasks" />

          <div class="w-[220px] overflow-hidden text-ellipsis">
            {{ item.description }}
          </div>
        </div>
        <UBadge size="xs" color="primary">
          <span v-if="item.tasks">milestone</span>
          <span v-else>task</span>
        </UBadge>
      </li>
    </ul>
  </div>
</template>
