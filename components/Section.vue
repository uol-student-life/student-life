<template>
  <section
    class="border-b border-b-neutral-200 bg-neutral-100 p-6 last:border-b-0"
  >
    <h2 class="pb-4 text-sm font-normal uppercase text-neutral-400">
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
