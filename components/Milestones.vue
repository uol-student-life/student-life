<template>
  <Section title="Milestones">
    <!-- Adds the popover button to add new milestones  -->
    <template #suffix>
      <UPopover :popper="{ placement: 'bottom' }">
        <UButton color="gray" icon="i-heroicons-plus-circle" variant="link" />
        <template #panel="{ close }">
          <MilestoneForm :onSubmit="() => onMilestoneCreated({ close })" />
        </template>
      </UPopover>
    </template>

    <div class="space-y-6 overflow-auto">
      <MilestoneSection
        :milestones="milestonesInProgress"
        title="In Progress"
        dataTestId="milestone-progress-section"
        :selectJournal="selectJournal"
        :getMilestonesList="props.getMilestonesList"
      />
      <MilestoneSection
        :milestones="milestonesCompleted"
        title="Completed"
        dataTestId="milestone-completed-section"
        :selectJournal="selectJournal"
        :getMilestonesList="props.getMilestonesList"
      />
    </div>
  </Section>
</template>

<script setup>
import { computed } from "vue";
import MilestoneSection from "./MilestoneSection";

const milestonesInProgress = computed(() => {
  return props.milestones.filter((item) => item.status === "INPROGRESS");
});

const milestonesCompleted = computed(() => {
  return props.milestones.filter((item) => item.status !== "INPROGRESS");
});

const onMilestoneCreated = ({ close }) => {
  close();
  props.getMilestonesList();
};

const props = defineProps({
  milestones: Array,
  selectJournal: Function,
  getMilestonesList: Function,
});
</script>
