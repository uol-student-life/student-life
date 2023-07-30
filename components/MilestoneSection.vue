<script setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";

const toast = useToast();
const isOpen = ref(false);
const selectedMilestone = ref(null);
const journals = ref([]);

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

const props = defineProps({
  milestones: Array,
  title: String,
  selectJournal: Function,
});
</script>

<template>
  <section class="bg-stone-100 px-6 last:border-b-0">
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
          class="cursor-pointer py-1 text-stone-600"
          @click="showJournals(milestone)"
        >
          {{ milestone.description }}
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
              <div class="font-semibold text-stone-500">
                {{ journals.length }}
              </div>
            </div>
          </template>
          <!-- milestone name -->
          <h2 class="mb-4 px-4 text-lg text-stone-500">
            {{ selectedMilestone?.description }}
          </h2>
          <!-- journal tagged with the milestone -->
          <ul>
            <li
              v-for="journal in journals"
              :key="journal"
              class="cursor-pointer p-4 hover:bg-stone-100"
              @click="handleJournalClick(journal)"
            >
              <div class="line-clamp-3" v-html="journal.html"></div>
            </li>
          </ul>
        </UCard>
      </USlideover>
    </div>
  </section>
</template>
