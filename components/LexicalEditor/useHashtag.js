import { MilestoneNode } from "./MilestoneNode";
import { mergeRegister } from "@lexical/utils";
import { useEffect } from "lexical-vue";
import { $getNodeByKey } from "lexical";

// https://github.com/facebook/lexical/issues/2685
export function useHashtag(editor, onRemove) {
  const milestoneNodes = ref(new Map());
  const milestonesID = ref(new Map());

  useEffect(() => {
    if (!editor.hasNodes([MilestoneNode])) {
      throw new Error("HashtagPlugin: MilestoneNode not registered on editor");
    }

    return mergeRegister(
      editor.registerMutationListener(MilestoneNode, (mutatedNodes) => {
        editor.getEditorState().read(() => {
          mutatedNodes.forEach((node) => {});
          for (const [nodeKey, mutation] of mutatedNodes) {
            const node = $getNodeByKey(nodeKey);
            const nodeID = node?.getID();
            // add to map if there is no such node yet
            if (mutation === "updated" && !milestoneNodes.value.get(nodeKey)) {
              milestoneNodes.value.set(nodeKey, nodeID);
              milestonesID.value.set(
                nodeID,
                (milestonesID.value.get(nodeID) ?? 0) + 1
              );
            }
            if (mutation === "created") {
              milestoneNodes.value.set(nodeKey, nodeID);
              milestonesID.value.set(
                nodeID,
                (milestonesID.value.get(nodeID) ?? 0) + 1
              );
            }
            if (mutation === "destroyed") {
              const removedNodeID = milestoneNodes.value.get(nodeKey);
              milestonesID.value.set(
                removedNodeID,
                milestonesID.value.get(removedNodeID) - 1
              );
              milestoneNodes.value.delete(nodeKey);
              if (milestonesID.value.get(removedNodeID) === 0) {
                onRemove(removedNodeID);
              }
            }
          }
        });
      })
    );
  });
}
