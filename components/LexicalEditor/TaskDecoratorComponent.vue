<script setup>
import { watch } from "vue";
import { updatedTask } from "~/stores/updatedTask";
import { removedTask } from "~/stores/removedTask";
import { $getNodeByKey } from "lexical";
import { DELETE_TASK_COMMAND } from "~/components/LexicalEditor/TaskNode";

watch(updatedTask, () => {
  // sync task state in editor and in tasks section
  if (updatedTask.id === props.id) {
    props.editor.update(() => {
      const node = $getNodeByKey(props.nodeKey);
      if (!node) {
        return;
      }
      node.setDescription(updatedTask.description);
      node.setChecked(updatedTask.checked);
      node.setDueDate(updatedTask.dueDate);
    });
  }
});

watch(removedTask, () => {
  // sync task state in editor and in tasks section
  if (removedTask.id === props.id) {
    props.editor.dispatchCommand(DELETE_TASK_COMMAND, {
      nodeKey: props.nodeKey,
    });
  }
});

const props = defineProps({
  id: Number,
  nodeKey: String,
  editor: Object,
  description: String,
  checked: Boolean,
  dueDate: [String, Boolean],
});
</script>

<template>
  <div class="my-4">
    <Task
      :description="props.description"
      :id="props.id"
      :checked="props.checked"
      :dueDate="props.dueDate"
      hideActions
    />
  </div>
</template>
