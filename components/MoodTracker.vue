<template>
  <Section title="Mood tracker">
    <div class="px-6">
      <!-- Mood chart -->
      <div>
        <MoodChart class="pb-4" :journals="journals" />
      </div>
    </div>
  </Section>
</template>

<script setup>
const props = defineProps({
  journals: Array,
});
</script>
