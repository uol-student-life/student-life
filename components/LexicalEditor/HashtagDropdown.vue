<script setup>
import { $getSelection } from "lexical";
import { getSelectedNode } from "~/components/LexicalEditor/utils";
import { PlusIcon, StarIcon, CheckIcon } from "@heroicons/vue/24/outline";
import { INSERT_MILESTONE_COMMAND } from "./MilestoneNode";
import { useEditor } from "lexical-vue";
import { hideHashtagDropdown } from "./utils";
import { vOnClickOutside } from "@vueuse/components";

const editor = useEditor();
const toast = useToast();

const createMilestone = async ({ name }) => {
  hideHashtagDropdown();
  const response = await $fetch("/api/milestone", {
    method: "POST",
    body: {
      description: name,
      to: {
        journalId: props.currentJournal.id,
      },
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to save milestone",
      description: error.data.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  //props.milestoneUpdated();
  if (response?.id) {
    editor.dispatchCommand(INSERT_MILESTONE_COMMAND, {
      id: response?.id,
    });
  }
};

const tagMilestone = async ({ id, description }) => {
  editor.dispatchCommand(INSERT_MILESTONE_COMMAND, { id, description });
  hideHashtagDropdown();
  await $fetch("/api/milestone/tag", {
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
};

const handleButtonClick = () => {
  editor.update(() => {
    const selection = $getSelection();
    const selectedNode = getSelectedNode(selection);

    createMilestone({ name: selectedNode.getTextContent().substring(1) });
  });
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
    id="tooltip"
    v-on-click-outside="hideHashtagDropdown"
  >
    <ul>
      <li class="cursor-pointer rounded px-2 py-1 hover:bg-stone-200">
        <button class="flex items-center gap-2" @click="handleButtonClick">
          <PlusIcon class="h-4 w-4" /> add milestone
        </button>
      </li>
      <li
        class="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 hover:bg-stone-200"
        v-for="item in items"
        :key="item.id"
        @click="tagMilestone({ id: item.id, description: item.description })"
      >
        <div class="flex items-center gap-2">
          <StarIcon class="h-4 w-4" v-if="item.tasks" />
          <CheckIcon class="h-4 w-4" v-if="!item.tasks" />

          <div class="w-[220px] overflow-hidden text-ellipsis">
            {{ item.description }}
          </div>
        </div>
        <UBadge size="xs" color="primary" v-if="item.tasks">
          <span v-if="item.tasks">milestone</span>
          <span v-else>task</span>
        </UBadge>
      </li>
    </ul>
  </div>
</template>
