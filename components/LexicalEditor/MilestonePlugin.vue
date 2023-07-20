<script setup>
import { $getSelection, COMMAND_PRIORITY_HIGH } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useEditor, useMounted } from "lexical-vue";
import {
  INSERT_MILESTONE_COMMAND,
  $createMilestoneNode,
} from "./MilestoneNode";
import { getSelectedNode, hideHashtagDropdown } from "./utils";

const editor = useEditor();

useMounted(() => {
  return mergeRegister(
    editor.registerCommand(
      INSERT_MILESTONE_COMMAND,
      ({ id }) => {
        const selection = $getSelection();
        const selectedNode = getSelectedNode(selection);
        const node = $createMilestoneNode({ id });
        selectedNode.replace(node);
        hideHashtagDropdown();

        return true;
      },
      COMMAND_PRIORITY_HIGH
    )
  );
});

const props = defineProps({
  currentJournal: Object,
  milestoneUpdated: Function,
});
</script>

<template></template>
