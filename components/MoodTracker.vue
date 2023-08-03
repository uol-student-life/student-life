<template>
  <Section title="Mood tracker">
    <!-- Mood chart -->
    <div class="px-6">
      <span>Mood Chart</span>
    </div>
    <!-- Mood icons -->
    <div class="flex justify-between px-6 py-4">
      <div class="text-center">
        <MoodIconsMotivated class="h-6 w-6" />
        <span class="text-xs text-stone-400">Motivated</span>
      </div>
      <div class="text-center">
        <MoodIconsRelaxed class="h-6 w-6" />
        <span class="text-xs text-stone-400">Relaxed</span>
      </div>
      <div class="text-center">
        <MoodIconsStressed class="h-6 w-6" />
        <span class="text-xs text-stone-400">Stressed</span>
      </div>
      <div class="text-center">
        <MoodIconsDepressed class="h-6 w-6" />
        <span class="text-xs text-stone-400">Depressed</span>
      </div>
    </div>
  </Section>
</template>
