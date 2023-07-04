<template>
  <Section title="Journal">
    <div class="flex justify-end">
      <!--tabs components-->
      <div class="flex rounded-lg bg-[#FAFAF9] p-0.5">
        <!-- menu icon-->
        <a href="#" v-on:keyup.enter | v-on:click="toggleTabs(1)">
          <div
            class="rounded-md p-1"
            v-bind:class="{
              'bg-[#FAFAF9]': openTab !== 1,
              'border  border-solid border-[#A8A29E] bg-[#E7E5E4]':
                openTab === 1,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="#4A5568"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </div>
        </a>
        <!-- calendar icon -->
        <a href="#" class="ml-2" v-on:keyup.enter | v-on:click="toggleTabs(2)">
          <div
            class="rounded-md p-1"
            v-bind:class="{
              'bg-[#FAFAF9]': openTab !== 2,
              'border  border-solid border-[#A8A29E] bg-[#E7E5E4]':
                openTab === 2,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="#4A5568"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
        </a>
      </div>
    </div>
  </Section>
</template>

<script>
export default {
  name: "grey-tabs",
  data() {
    return {
      openTab: 1,
    };
  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber;
    },
  },
};
</script>
