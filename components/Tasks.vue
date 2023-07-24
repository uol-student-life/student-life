<template>
  <Section title="Tasks"> 

    <!-- Adds the popover button to add new tasks  -->
    <template #suffix>
      <UPopover :popper="{ placement: 'bottom' }">
        <UButton color="gray" icon="i-heroicons-plus-circle" variant="link" />
        <template #panel="{ close }" >
          <form >
            <div class="grid grid-cols-1 align-center gap-4 p-6">
              <USelect :options="[0, 1, 2, 3, 4, 5]" color="gray" variant="outline" placeholder="Select Milestone"/>
              <UInput type='text' color="gray" placeholder="New Task"/>
              <UInput type='datetime-local' color="gray" placeholder="Date" />
              <div class="flex w-full justify-center">
                <UButton color="blue" variant="outline" class="text-gray-50 bg-slate-400 justify-center p-3 w-2/3 hover:bg-slate-500" type="submit"> Add Task </UButton>
              </div>
            </div>
          </form>
        </template>
      </UPopover> 
    </template>

  </Section>
</template>
