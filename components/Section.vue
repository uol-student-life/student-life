<template>
  <section
    class="grid grid-rows-[auto_1fr] border-b border-b-stone-200 bg-stone-100 last:border-b-0"
  >
    <h2 class="p-6 text-sm font-normal uppercase text-stone-400">
      {{ title }}
    </h2>

    <slot></slot>
  </section>
</template>

<script>
export default {
  props: ["title"],
};
</script>
