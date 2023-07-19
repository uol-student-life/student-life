<template>
  <Section title="Milestones">
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
  </Section>
</template>

<script setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";

const isOpen = ref(false);
</script>
