<script setup>
import { $getNodeByKey, $getSelection, COMMAND_PRIORITY_HIGH } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useEditor, useMounted } from "lexical-vue";
import { getSelectedNode, hideHashtagDropdown } from "./utils";
import {
  DELETE_MILESTONE_COMMAND,
  MilestoneNode,
  INSERT_MILESTONE_COMMAND,
  $createMilestoneNode,
} from "~/components/LexicalEditor/MilestoneNode";

const editor = useEditor();
const toast = useToast();

const getMilestoneDataById = ({ node }) => {
  const id = node.getID();

  $fetch("/api/milestone", {
    params: {
      id,
    },
  })
    .then((response) => {
      editor.update(() => {
        node.setDescription(response?.description);
      });
    })
    .catch((error) => {
      if (error.status === 400) {
        editor.dispatchCommand(DELETE_MILESTONE_COMMAND, {
          nodeKey: node.getKey(),
        });

        return;
      }
      toast.add({
        title: "Fail to fetch milestone description",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

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
    ),
    editor.registerCommand(
      DELETE_MILESTONE_COMMAND,
      ({ nodeKey }) => {
        const node = $getNodeByKey(nodeKey);
        node.remove();
      },
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerMutationListener(MilestoneNode, (mutatedNodes) => {
      editor.update(() => {
        for (const [nodeKey, mutation] of mutatedNodes) {
          const node = $getNodeByKey(nodeKey);
          if (!node) {
            continue;
          }
          const description = node.getDescription();
          if (!description) {
            getMilestoneDataById({ node });
          }
        }
      });
    })
  );
});

const props = defineProps({
  currentJournal: Object,
  milestoneUpdated: Function,
});
</script>

<template></template>
