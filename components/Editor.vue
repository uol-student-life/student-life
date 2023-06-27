<script setup lang="ts">
import { $getRoot, $getSelection } from 'lexical'
import { ref } from 'vue'

import {
  LexicalAutoFocusPlugin,
  LexicalComposer,
  LexicalContentEditable,
  LexicalHistoryPlugin,
  LexicalOnChangePlugin,
  LexicalRichTextPlugin,
  LexicalAutoLinkPlugin,
  LexicalLinkPlugin,
  LexicalListPlugin
} from 'lexical-vue'

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'

const config = {
  editable: true,
  theme: {
    // Theme styling goes here
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
  ],
  onError(error) {
    console.error(error)
  },
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot()
    const selection = $getSelection()

    console.log(root, selection)
  })
}

const URL_MATCHER
    = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const MATCHERS = [
  (text) => {
    const match = URL_MATCHER.exec(text)
    return (
        match && {
          index: match.index,
          length: match[0].length,
          text: match[0],
          url: match[0],
        }
    )
  },
]

// Two-way binding
const content = ref('')
</script>

<template>
  <div class="relative">
    <LexicalComposer :initial-config="config">
      <LexicalRichTextPlugin>
        <template #contentEditable>
          <LexicalContentEditable />
        </template>
        <template #placeholder>
          <div class="pointer-events-none absolute top-0 left-0">
            Enter some text...
          </div>
        </template>
      </LexicalRichTextPlugin>
      <LexicalOnChangePlugin v-model="content" @change="onChange" />
      <LexicalHistoryPlugin />
      <LexicalAutoFocusPlugin />
      <LexicalLinkPlugin />
      <LexicalAutoLinkPlugin :matchers="MATCHERS" />
      <LexicalListPlugin />
    </LexicalComposer>
  </div>
</template>
