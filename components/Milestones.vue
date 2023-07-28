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

    <template
      class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_1fr)] overflow-hidden"
    >
      <section class="grid grid-rows-[auto_1fr] bg-stone-100 last:border-b-0">
        <div class="flex items-center justify-between gap-2 p-2 px-6">
          <h2 class="text-md flex items-center font-extrabold text-stone-400">
            In Progress
          </h2>
          <h2 class="text-md font-extrabold text-stone-400">1</h2>
        </div>

        <!-- Panel slider -->
        <div>
          <UButton class="ml-6" label="Milestone" @click="isOpen = true" />
          <USlideover v-model="isOpen">
            <UCard
              class="flex flex-1 flex-col"
              :ui="{
                body: { base: 'flex-1' },
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
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
                  <!-- milestone counter -->
                  <div class="font-semibold text-stone-500">0</div>
                </div>
              </template>
              <!-- milestone name -->
              <div>milestone name goes here</div>
              <!-- journal tagged with the milestone -->
              <div>journal list goes here</div>
            </UCard>
          </USlideover>
        </div>
      </section>
      <section class="grid grid-rows-[auto_1fr] bg-stone-100 last:border-b-0">
        <div class="flex items-center justify-between gap-2 p-2 px-6">
          <h2 class="text-md flex items-center font-extrabold text-stone-400">
            Completed
          </h2>
          <h2 class="text-md font-extrabold text-stone-400">0</h2>
        </div>
      </section>
    </template>
  </Section>
</template>

<script setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";

const isOpen = ref(false);
</script>
