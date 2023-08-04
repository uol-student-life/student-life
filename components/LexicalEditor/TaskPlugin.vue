<script setup>
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_HIGH,
  $getNodeByKey,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useEditor, useMounted } from "lexical-vue";
import {
  INSERT_TASK_COMMAND,
  CREATE_TASK_COMMAND,
  $createTaskNode,
  DELETE_TASK_COMMAND,
  TaskNode,
} from "./TaskNode";
import {
  getSelectedNode,
  hideHashtagDropdown,
  showLexicalDropdown,
  hideTaskDropdown,
} from "./utils";
import { vOnClickOutside } from "@vueuse/components";
import { TASK_DROPDOWN_ID, TASK_DROPDOWN_SELECTOR } from "./constants";
import TaskForm from "~/components/TaskForm";

const STATUSES = {
  TODO: "TODO",
  DONE: "DONE",
};
const toast = useToast();
const editor = useEditor();
const selectedNode = ref(null);
const isDropdownVisible = ref(false);

const getTaskDataById = ({ node }) => {
  const id = node.getID();

  $fetch("/api/task", {
    params: {
      id,
    },
  })
    .then((response) => {
      if (!response.description) {
        editor.dispatchCommand(DELETE_TASK_COMMAND, {
          nodeKey: node.getKey(),
        });
        return;
      }

      editor.update(() => {
        node.setDescription(response?.description);
        node.setChecked(response?.status === STATUSES.DONE);
        node.setDueDate(response?.dueDate);
      });
    })
    .catch((error) => {
      toast.add({
        title: "Fail to fetch task description",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

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
    ),
    editor.registerCommand(
      DELETE_TASK_COMMAND,
      ({ nodeKey }) => {
        const node = $getNodeByKey(nodeKey);
        node.remove();
      },
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerMutationListener(TaskNode, (mutatedNodes) => {
      editor.update(() => {
        for (const [nodeKey, mutation] of mutatedNodes) {
          const node = $getNodeByKey(nodeKey);
          if (!node) {
            continue;
          }
          const description = node.getDescription();
          if (!description) {
            getTaskDataById({ node });
          }
        }
      });
    })
  );
});

const hideDropdown = () => {
  hideTaskDropdown();
  isDropdownVisible.value = false;
};

const handleTaskCreation = (task) => {
  hideDropdown();
  props.milestoneUpdated();
  editor.update(() => {
    editor.dispatchCommand(INSERT_TASK_COMMAND, { id: task.id });
  });
};

const props = defineProps({
  currentJournal: Object,
  milestoneUpdated: Function,
});
</script>

<template>
  <div
    class="z-50 hidden min-w-[300px] rounded bg-stone-100 p-1 text-base text-stone-700 shadow-md"
    :id="TASK_DROPDOWN_ID"
    v-on-click-outside="hideDropdown"
  >
    <TaskForm
      :onTaskSubmit="handleTaskCreation"
      v-if="isDropdownVisible"
      :journalId="currentJournal.id"
    />
  </div>
</template>
