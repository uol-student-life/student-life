import { $isAtNodeEnd } from "@lexical/selection";

// taken from https://github.com/wobsoriano/lexical-vue/tree/main
export function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) return anchorNode;

  const isBackward = selection.isBackward();
  if (isBackward) return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  else return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
}

export const hideHashtagDropdown = () => {
  const tooltip = document.querySelector("#tooltip");
  if (!tooltip) {
    return;
  }
  tooltip.classList.remove("visible");
  tooltip.classList.add("hidden");
};
