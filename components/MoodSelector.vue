<template>
  <div class="flex justify-between">
    <div class="flex-col text-center">
      <button class="transition duration-150 hover:scale-150">
        <MoodIconsMotivated class="h-6 w-6" />
      </button>
      <div class="text-xs text-stone-400">Motivated</div>
    </div>

    <div class="text-center">
      <button class="transition duration-150 hover:scale-150">
        <MoodIconsRelaxed class="h-6 w-6" />
      </button>
      <div class="text-xs text-stone-400">Relaxed</div>
    </div>
    <div class="text-center">
      <button class="transition duration-150 hover:scale-150">
        <MoodIconsStressed class="h-6 w-6" />
      </button>
      <div class="text-xs text-stone-400">Stressed</div>
    </div>
    <div class="text-center">
      <button class="transition duration-150 hover:scale-150">
        <MoodIconsDepressed class="h-6 w-6" />
      </button>
      <div class="text-xs text-stone-400">Depressed</div>
    </div>
  </div>
</template>
