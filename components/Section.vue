<template>
  <section class="border-b border-b-stone-200 bg-stone-100 last:border-b-0">
    <h2 class="p-6 text-sm font-normal uppercase text-stone-400">
      {{ title }}
    </h2>

    <div class="h-full overflow-auto">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  props: ["title"],
};
</script>
