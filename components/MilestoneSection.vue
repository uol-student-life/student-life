<script setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { removedMilestone } from "../stores/removedMilestone";
import { updatedMilestone } from "../stores/updatedMilestone";
import MilestoneForm from "./MilestoneForm";

const toast = useToast();
const isOpen = ref(false);
const selectedMilestone = ref(null);
const journals = ref([]);
const isAlertDialogOpen = ref(false);
const isDeleting = ref(false);

const showJournals = (milestone) => {
  isOpen.value = true;
  selectedMilestone.value = milestone;

  const journalsIds = [];
  milestone.journals.forEach((item) => {
    if (item.journalId) {
      journalsIds.push(item.journalId);
    }
  });

  if (journalsIds.length) {
    getJournals(journalsIds);
  }
};

const getJournals = async (ids) => {
  await $fetch("/api/journals", {
    params: {
      ids: ids.join(","),
    },
  })
    .then((response) => {
      journals.value = response;
    })
    .catch((error) => {
      toast.add({
        title: `Fail to fetch journals for ${selectedMilestone.value.description} milestone`,
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    });
};

const handleJournalClick = (journal) => {
  props.selectJournal(journal);
  isOpen.value = false;
};

const onMilestoneUpdated = ({ data, close }) => {
  close();
  updatedMilestone.id = data.id;
  updatedMilestone.description = data.description;
  props.getMilestonesList();
};

const deleteMilestone = (id) => {
  isDeleting.value = true;

  $fetch("/api/milestone", {
    method: "DELETE",
    params: {
      id: id,
    },
  })
    .then(() => {
      props.getMilestonesList();
    })
    .catch((error) => {
      toast.add({
        title: "Fail to remove milestone",
        description: error.data.message,
        color: "red",
        icon: "i-heroicons-exclamation-circle",
      });
    })
    .finally(() => {
      isDeleting.value = false;
      isAlertDialogOpen.value = false;
      // need this to sync milestone state in editor and in milestone section
      removedMilestone.id = id;
    });
};

const onCancelDialog = () => {
  isAlertDialogOpen.value = false;
};

const openAlertDialog = (e, milestone) => {
  e.preventDefault();
  e.stopPropagation();
  selectedMilestone.value = milestone;
  isAlertDialogOpen.value = true;
};

const onStatusUpdate = ({ close }) => {
  close();
  props.getMilestonesList();
};

const props = defineProps({
  milestones: Array,
  title: String,
  selectJournal: Function,
  getMilestonesList: Function,
  dataTestId: String,
});
</script>

<template>
  <section
    class="bg-stone-100 px-6 last:border-b-0"
    :data-testid="props.dataTestId"
  >
    <div class="flex items-center justify-between gap-2 py-2">
      <h2 class="text-md flex items-center font-bold text-stone-400">
        {{ title }}
      </h2>
      <div
        class="text-md flex h-7 w-7 items-center justify-center font-bold text-stone-400"
      >
        {{ milestones.length }}
      </div>
    </div>

    <div>
      <ul>
        <li
          v-for="milestone in milestones"
          :key="milestone"
          class="group flex cursor-pointer items-center justify-between gap-4 py-1 text-sm text-stone-600"
          @click="showJournals(milestone)"
          data-testid="milestone-item"
        >
          <span data-testid="milestone-name">{{ milestone.description }}</span>

          <div class="flex items-center justify-between">
            <UPopover :popper="{ placement: 'bottom' }">
              <UButton
                color="gray"
                :icon="
                  milestone.status === 'INPROGRESS'
                    ? 'i-heroicons-check-circle'
                    : 'i-heroicons-clock'
                "
                variant="link"
                title="Change milestone status"
                size="md"
                class="invisible opacity-50 hover:opacity-100 group-hover:visible"
              />

              <template #panel="{ close }">
                <MilestoneStatusForm
                  :onSubmit="() => onStatusUpdate({ close })"
                  :id="milestone.id"
                  :status="milestone.status"
                />
              </template>
            </UPopover>

            <UPopover :popper="{ placement: 'bottom' }">
              <UButton
                color="gray"
                icon="i-heroicons-pencil"
                variant="link"
                title="Edit milestone"
                size="xs"
                class="invisible opacity-50 hover:opacity-100 group-hover:visible"
              />

              <template #panel="{ close }">
                <MilestoneForm
                  :onSubmit="(data) => onMilestoneUpdated({ data, close })"
                  :id="milestone.id"
                  :description="milestone.description"
                />
              </template>
            </UPopover>

            <UButton
              color="gray"
              icon="i-heroicons-trash"
              variant="link"
              size="xs"
              class="invisible opacity-50 hover:opacity-100 group-hover:visible"
              title="Remove milestone"
              @click="(e) => openAlertDialog(e, milestone)"
            />
          </div>
        </li>
      </ul>
      <!-- Panel slider -->
      <USlideover v-model="isOpen">
        <UCard
          class="flex flex-1 flex-col bg-stone-100"
          :ui="{
            body: { base: 'flex-1', padding: 'py-5' },
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            background: 'bg-stone-50',
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="item-center flex">
                <button class="pr-2" @click="isOpen = false">
                  <ArrowLeftIcon
                    class="max-w-4 h-4 text-stone-700 hover:text-stone-500"
                  />
                </button>
                <span class="pl-2 font-semibold text-stone-500">Back</span>
              </div>
              <!-- journals counter -->
              <div class="font-semibold text-stone-400">
                {{ journals.length }}
              </div>
            </div>
          </template>
          <!-- milestone name -->
          <h2
            class="bg-primary-500 mx-4 mb-4 flex items-center space-x-3 rounded-lg px-4 py-3 text-lg text-white"
          >
            <UIcon class="h-6 w-6 text-white" name="i-heroicons-star-solid" />
            <span>{{ selectedMilestone?.description }}</span>
          </h2>
          <!-- journal tagged with the milestone -->
          <ul>
            <li
              v-for="journal in journals"
              :key="journal"
              class="cursor-pointer p-4 hover:bg-stone-100"
              @click="handleJournalClick(journal)"
            >
              <div class="flex space-x-2">
                <div>
                  <UIcon
                    class="h-6 w-6 text-gray-400"
                    name="i-heroicons-document-text"
                  />
                </div>
                <span class="line-clamp-2">
                  {{ stripHtml(journal.html) }}
                </span>
              </div>
            </li>
          </ul>
        </UCard>
      </USlideover>
    </div>
    <AlertDialog
      :isOpen="isAlertDialogOpen"
      :onCancel="onCancelDialog"
      :onConfirm="() => deleteMilestone(selectedMilestone.id)"
      confirmColor="red"
      :loading="isDeleting"
    >
      <template #header> Are you absolutely sure? </template>

      <template #body>
        This action cannot be undone and will permanently remove your milestone.
      </template>

      <template #action-text> Yes, delete milestone </template>
    </AlertDialog>
  </section>
</template>
