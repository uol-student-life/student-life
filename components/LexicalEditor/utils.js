import { $isAtNodeEnd } from "@lexical/selection";
import { createPopper } from "@popperjs/core";
import { HASHTAG_DROPDOWN_SELECTOR, TASK_DROPDOWN_SELECTOR } from "./constants";

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

export const hideLexicalDropdown = (selector) => {
  const tooltip = document.querySelector(selector);
  if (!tooltip) {
    return;
  }
  tooltip.classList.remove("visible");
  tooltip.classList.add("hidden");
};

export const hideHashtagDropdown = () => {
  hideLexicalDropdown(HASHTAG_DROPDOWN_SELECTOR);
};

export const hideTaskDropdown = () => {
  hideLexicalDropdown(TASK_DROPDOWN_SELECTOR);
};

export const showLexicalDropdown = (element, selector) => {
  const tooltip = document.querySelector(selector);
  tooltip.classList.add("visible");
  tooltip.classList.remove("hidden");
  createPopper(element, tooltip, {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });
};
