<template>
  <Section title="Milestones">
    <!-- Adds the popover button to add new milestones  -->
    <template #suffix>
      <UPopover :popper="{ placement: 'bottom' }">
        <UButton color="gray" icon="i-heroicons-plus-circle" variant="link" />
        <template #panel="{ close }">
          <form>
            <div class="align-center flex justify-between gap-4 p-6">
              <UInput
                type="milestone"
                color="gray"
                placeholder="New Milestone"
              />
              <UButton color="gray" type="submit"> Add Milestone </UButton>
            </div>
          </form>
        </template>
      </UPopover>
    </template>

    <div class="overflow-auto space-y-6">
      <MilestoneSection
        :milestones="milestonesInProgress"
        title="In Progress"
        :selectJournal="selectJournal"
        :getMilestonesList="props.getMilestonesList"
      />
      <MilestoneSection
        :milestones="milestonesCompleted"
        title="Completed"
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

const props = defineProps({
  milestones: Array,
  selectJournal: Function,
  getMilestonesList: Function,
});
</script>
