<template>
  <Section title="Tasks">
    <!-- Adds the popover button to add new tasks  -->
    <template #suffix>
      <UPopover :popper="{ placement: 'bottom' }">
        <UButton color="gray" icon="i-heroicons-plus-circle" variant="link" />
        <template #panel="{ close }">
          <TaskCreationForm :options="[0, 1, 2, 3, 4, 5]" />
        </template>
      </UPopover>
    </template>

    <div class="overflow-auto">
      <!-- Accordion Component -->
      <UAccordion
        :items="list"
        :ui="{ wrapper: 'flex flex-col w-full' }"
        size="xl"
        class=""
      >
        <template #default="{ item, index, open }">
          <UButton
            variant="ghost"
            class="border-b border-gray-200 text-stone-400 hover:bg-stone-200 dark:border-gray-700"
            :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
          >
            <!-- Chevron template -->
            <template #leading>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="h-5 w-5 transform p-4 transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
            <!-- Milestone name -->
            <template #trailing>
              <span class="truncate p-4"
                >{{ index + 1 }}. {{ item.mile_title }}</span
              >
            </template>
          </UButton>
        </template>

        <!-- Task list -->
        <template #item="{ item }">
          <div v-for="(tsk, index) in item.tasks" :key="index" class="in-line">
            <div class="mx-6 border-b p-3">
              <UCheckbox color="blue" v-bind:label="tsk" />
            </div>
          </div>
        </template>
      </UAccordion>
    </div>
  </Section>
</template>

<script setup>
import { _hidden } from "#tailwind-config/theme/aria";
import TaskCreationForm from "./TaskCreationForm";

// Sample list
const m_list = [
  {
    mile_title: "First Milestone 1",
    tasks: ["Item 1", "Item 2"],
  },
  {
    mile_title: "Second Milestone 2",
    tasks: ["Item 1", "Item 2"],
  },
  {
    mile_title: "Third Milestone 3",
    tasks: ["Item 1", "Item 2", "Item 2"],
  },
  {
    mile_title: "Fourth Milestone 4",
    tasks: ["Item 1", "Item 2"],
  },
  {
    mile_title: "Fifth Milestone 5",
    tasks: ["Item 1", "Item 2"],
  },
  {
    mile_title: "Sixth Milestone 6",
    tasks: ["Item 1", "Item 2", "Item 2"],
  },
];
//  Sample list as ref
const list = ref(
  m_list.map((item) => {
    return { ...item, open: false };
  })
);

// -----Code to use with props-----
// const props = defineProps({
//   milestones:{
//     Array,
//   }
// });
// const list = props.milestones;
</script>
