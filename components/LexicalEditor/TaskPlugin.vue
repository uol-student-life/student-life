<script setup>
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useEditor, useMounted } from "lexical-vue";
import {
  INSERT_TASK_COMMAND,
  CREATE_TASK_COMMAND,
  $createTaskNode,
} from "./TaskNode";
import {
  getSelectedNode,
  hideHashtagDropdown,
  showLexicalDropdown,
  hideTaskDropdown,
} from "./utils";
import { vOnClickOutside } from "@vueuse/components";
import { TASK_DROPDOWN_ID, TASK_DROPDOWN_SELECTOR } from "./constants";
import TaskCreationForm from "~/components/TaskCreationForm";

const editor = useEditor();
const selectedNode = ref(null);
const isDropdownVisible = ref(false);

useMounted(() => {
  return mergeRegister(
    editor.registerCommand(
      INSERT_TASK_COMMAND,
      ({ id, replaceNode }) => {
        const taskNode = $createTaskNode({ id });
        if (replaceNode) {
          replaceNode.replace(taskNode);
        } else {
          selectedNode.value.replace(taskNode);
        }
        const paragraphNode = $createParagraphNode();
        taskNode.insertAfter(paragraphNode);
        paragraphNode.select();
      },
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(
      CREATE_TASK_COMMAND,
      ({ id }) => {
        const selection = $getSelection();
        selectedNode.value = getSelectedNode(selection);
        const element = editor.getElementByKey(selectedNode.value.getKey());
        hideHashtagDropdown();
        showLexicalDropdown(element, TASK_DROPDOWN_SELECTOR);
        isDropdownVisible.value = true;
      },
      COMMAND_PRIORITY_LOW
    )
  );
});

const hideDropdown = () => {
  hideTaskDropdown();
  isDropdownVisible.value = false;
};

const handleTaskCreation = (task) => {
  hideDropdown();
  editor.update(() => {
    editor.dispatchCommand(INSERT_TASK_COMMAND, { id: task.id });
  });
};

const props = defineProps({
  currentJournal: Object,
});
</script>

<template>
  <div
    class="z-50 hidden min-w-[300px] rounded bg-stone-100 p-1 text-base text-stone-700 shadow-md"
    :id="TASK_DROPDOWN_ID"
    v-on-click-outside="hideDropdown"
  >
    <TaskCreationForm
      :onTaskSubmit="handleTaskCreation"
      v-if="isDropdownVisible"
      :journalId="currentJournal.id"
    />
  </div>
</template>
