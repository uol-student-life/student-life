<template>
  <div class="grid h-screen grid-rows-[minmax(0,_1fr)_auto] bg-neutral-50">
    <main class="grid grid-cols-[25%_50%_25%]">
      <aside
        class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_300px)] overflow-hidden"
      >
        <Journal />
        <MoodTracker />
      </aside>

      <div class="border-x border-x-neutral-200">
        <ClientOnly>
          <Editor />
        </ClientOnly>
      </div>

      <aside
        class="grid min-h-full grid-rows-[minmax(0,_1fr)_minmax(0,_1fr)] overflow-hidden"
      >
        <Milestones />
        <Tasks />
      </aside>
    </main>

    <footer class="border-t border-t-neutral-200 p-2 text-sm text-neutral-400">
      240 words
    </footer>
  </div>
</template>
