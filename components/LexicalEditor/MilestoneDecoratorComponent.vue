<script setup>
import { watch } from "vue";
import { StarIcon } from "@heroicons/vue/24/outline";
import { $getNodeByKey } from "lexical";
import { updatedMilestone } from "~/stores/updatedMilestone";
import { removedMilestone } from "~/stores/removedMilestone";
import { DELETE_MILESTONE_COMMAND } from "~/components/LexicalEditor/MilestoneNode";

watch(updatedMilestone, () => {
  // sync milestone state in editor and in milestones section
  if (updatedMilestone.id === props.id) {
    props.editor.update(() => {
      const node = $getNodeByKey(props.nodeKey);
      if (!node) {
        return;
      }
      node.setDescription(updatedMilestone.description);
    });
  }
});

watch(removedMilestone, () => {
  // sync milestone state in editor and in milestones section
  if (removedMilestone.id === props.id) {
    props.editor.dispatchCommand(DELETE_MILESTONE_COMMAND, {
      nodeKey: props.nodeKey,
    });
  }
});

const props = defineProps({
  id: Number,
  description: String,
  nodeKey: String,
  editor: Object,
});
</script>

<template>
  <UBadge color="orange" variant="solid">
    <StarIcon class="mr-1 h-4 w-4" />
    <span data-testid="editor-milestone">{{ props.description }}</span>
  </UBadge>
</template>
