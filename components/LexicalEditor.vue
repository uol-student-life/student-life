<script setup lang="ts">
import theme from "./LexicalEditor/theme";
import { ref } from "vue";
import { $generateHtmlFromNodes } from "@lexical/html";

import {
  LexicalAutoFocusPlugin,
  LexicalComposer,
  LexicalContentEditable,
  LexicalHistoryPlugin,
  LexicalOnChangePlugin,
  LexicalRichTextPlugin,
  LexicalLinkPlugin,
  LexicalListPlugin,
} from "lexical-vue";

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";

import AutoLinkPlugin from "./LexicalEditor/AutoLinkPlugin.vue";
import MarkdownShortcutPlugin from "./LexicalEditor/MarkdownShortcutPlugin.vue";
import CodeHighlightPlugin from "./LexicalEditor/CodeHighlightPlugin.vue";
import HashtagPlugin from "./LexicalEditor/HashtagPlugin";
import { MilestoneNode } from "./LexicalEditor/MilestoneNode";
import { TaskNode } from "./LexicalEditor/TaskNode";
import { $getRoot } from "lexical";
import { wordCount } from "../stores/wordCount";

const config = {
  editable: true,
  editorState: props.value || null,
  theme,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    HashtagNode,
    MilestoneNode,
    TaskNode,
  ],
  onError(error) {
    console.error(error);
  },
};

const emit = defineEmits(["onChange"]);

// check whether editor is empty
function isEmpty() {
  return (
    $getRoot().getFirstChild()?.isEmpty() && $getRoot().getChildrenSize() === 1
  );
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState, editor) {
  editorState.read(() => {
    const data = {
      lexical: JSON.stringify(editorState.toJSON()),
      html: isEmpty() ? "" : $generateHtmlFromNodes(editor),
    };

    wordCount.value = getWordCount($getRoot().getTextContent());
    emit("onChange", data);
  });
}

function getWordCount(content = "") {
  return content.trim().split(/\s+/).length;
}

// Two-way binding
const content = ref("");

const props = defineProps({
  value: String,
  currentJournal: Object,
  milestoneUpdated: Function,
});
</script>

<template>
  <div class="px-8 py-4">
    <div class="relative">
      <LexicalComposer :initial-config="config">
        <LexicalRichTextPlugin>
          <template #contentEditable>
            <LexicalContentEditable class="outline-none" />
          </template>
          <template #placeholder>
            <div
              class="pointer-events-none absolute left-0 top-0 text-neutral-400"
            >
              Enter some text...
            </div>
          </template>
        </LexicalRichTextPlugin>
        <LexicalOnChangePlugin @change="onChange" />
        <LexicalHistoryPlugin />
        <LexicalAutoFocusPlugin />
        <LexicalLinkPlugin />
        <AutoLinkPlugin />
        <MarkdownShortcutPlugin />
        <CodeHighlightPlugin />
        <LexicalListPlugin />
        <HashtagPlugin
          :milestoneUpdated="milestoneUpdated"
          :currentJournal="currentJournal"
        />
      </LexicalComposer>
    </div>
  </div>
</template>

<!--styles mostly taken from https://github.com/wobsoriano/lexical-vue/tree/main/playground-->
<style>
.editor-container {
  margin: 20px auto 20px auto;
  border-radius: 2px;
  max-width: 600px;
  color: #000;
  position: relative;
  line-height: 20px;
  font-weight: 400;
  text-align: left;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.editor-inner {
  background: #fff;
  position: relative;
}

.editor-input {
  min-height: 150px;
  resize: none;
  font-size: 15px;
  position: relative;
  tab-size: 1;
  outline: 0;
  padding: 15px 10px;
  caret-color: #444;
}

.editor-placeholder {
  color: #999;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  top: 15px;
  left: 10px;
  font-size: 15px;
  user-select: none;
  display: inline-block;
  pointer-events: none;
}

.editor-text-bold {
  font-weight: bold;
}

.editor-text-italic {
  font-style: italic;
}

.editor-text-underline {
  text-decoration: underline;
}

.editor-text-strikethrough {
  text-decoration: line-through;
}

.editor-text-underlineStrikethrough {
  text-decoration: underline line-through;
}

.editor-text-code {
  background-color: rgb(240, 242, 245);
  padding: 1px 0.25rem;
  font-family: Menlo, Consolas, Monaco, monospace;
  font-size: 94%;
}

.editor-text-hashtag {
  background-color: rgba(88, 144, 255, 0.15);
  border-bottom: 1px solid rgba(88, 144, 255, 0.3);
}

.editor-link {
  color: rgb(33, 111, 219);
  text-decoration: none;
}

.editor-code {
  @apply bg-neutral-100;
  font-family: Menlo, Consolas, Monaco, monospace;
  display: block;
  padding: 8px 8px 8px 52px;
  line-height: 1.53;
  font-size: 13px;
  margin: 0;
  margin-top: 8px;
  margin-bottom: 8px;
  tab-size: 2;
  /* white-space: pre; */
  overflow-x: auto;
  position: relative;
}

.editor-code:before {
  content: attr(data-gutter);
  position: absolute;
  background-color: #eee;
  left: 0;
  top: 0;
  border-right: 1px solid #ccc;
  padding: 8px;
  color: #777;
  white-space: pre-wrap;
  text-align: right;
  min-width: 25px;
}
.editor-code:after {
  content: attr(data-highlight-language);
  top: 0;
  right: 3px;
  padding: 3px;
  font-size: 10px;
  text-transform: uppercase;
  position: absolute;
  color: rgba(0, 0, 0, 0.5);
}

.editor-tokenComment {
  color: slategray;
}

.editor-tokenPunctuation {
  color: #999;
}

.editor-tokenProperty {
  color: #905;
}

.editor-tokenSelector {
  color: #690;
}

.editor-tokenOperator {
  color: #9a6e3a;
}

.editor-tokenAttr {
  color: #07a;
}

.editor-tokenVariable {
  color: #e90;
}

.editor-tokenFunction {
  color: #dd4a68;
}

.editor-paragraph {
  @apply mb-2 text-stone-600;
  position: relative;
}

.editor-heading-h1 {
  @apply mb-4 text-xl font-bold text-stone-600;
}

.editor-heading-h2 {
  @apply mb-4 mt-4 border-b border-b-neutral-200 pb-4 text-lg font-medium text-stone-600;
}

.editor-quote {
  margin-left: 20px;
  font-size: 15px;
  color: rgb(101, 103, 107);
  border-left-color: rgb(206, 208, 212);
  border-left-width: 4px;
  border-left-style: solid;
  padding-left: 16px;
}

.editor-list-ol {
  margin-left: 16px;
  list-style: revert;
}

.editor-list-ul {
  margin-left: 16px;
  list-style: unset;
}

.editor-listitem {
  margin: 8px 32px 8px 32px;
}

.editor-nested-listitem {
  list-style-type: none;
}

pre::-webkit-scrollbar {
  background: transparent;
  width: 10px;
}

pre::-webkit-scrollbar-thumb {
  background: #999;
}
</style>
