<template>
  <Section title="Tasks">
    <!-- Adds the popover button to add new tasks  -->
    <template #suffix>
      <UPopover :popper="{ placement: 'bottom' }">
        <UButton color="gray" icon="i-heroicons-plus-circle" variant="link" />
        <template #panel="{ close }">
          <TaskForm
            :options="milestones"
            :onTaskSubmit="() => onTaskSubmit(close)"
          />
        </template>
      </UPopover>
    </template>

    <div class="overflow-auto">
      <!-- Accordion Component -->
      <UAccordion
        :items="list"
        :ui="{ wrapper: 'flex flex-col w-full' }"
        size="xl"
      >
        <template #default="{ item, index, open }">
          <UButton
            variant="ghost"
            class="border-b border-gray-200 pl-5 text-stone-400 hover:bg-stone-200 dark:border-gray-700"
            :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
          >
            <!-- Chevron template -->
            <template #leading>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="h-5 w-5 transform p-3 transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
            <!-- Milestone name -->
            <template #trailing>
              <span class="truncate p-4">{{ item.description }}</span>
            </template>
          </UButton>
        </template>

        <!-- Task list -->
        <template #item="{ item }">
          <div v-for="(task, index) in item.tasks" :key="index" class="in-line">
            <div class="mx-4 border-b p-3">
              <Task
                :description="task.description"
                :id="task.id"
                :checked="task.status === 'DONE'"
                :dueDate="task.dueDate"
              />
            </div>
          </div>
        </template>
      </UAccordion>
    </div>
  </Section>
</template>

<script setup>
import TaskForm from "./TaskForm";
import { computed } from "vue";
import Task from "./Task";

const list = computed(() => {
  if (props.milestones.length === 0) return [];

  const milestonesList = props.milestones?.map((item) => {
    return { ...item, open: false };
  });

  return milestonesList.filter((item) => item.tasks.length);
});

const onTaskSubmit = (closeFn) => {
  props.milestoneUpdated();
  return closeFn();
};

const props = defineProps({
  milestones: {
    type: Array,
    default: () => [],
  },
  milestoneUpdated: Function,
});
</script>
