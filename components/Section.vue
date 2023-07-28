<template>
  <section
    class="grid grid-rows-[auto_1fr] border-b border-b-stone-200 bg-stone-100 last:border-b-0"
  >
    <div class="flex items-center justify-between gap-2 px-6 py-4">
      <h2
        class="flex items-center text-sm font-normal uppercase text-stone-400"
      >
        {{ title }}
      </h2>

      <slot name="suffix"></slot>
    </div>

    <slot></slot>
  </section>
</template>

<script>
export default {
  props: ["title"],
};
</script>
