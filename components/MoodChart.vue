<script setup>
Chart.defaults.color = "#78716c";

import { watch } from "vue";
import {
  getDaysInMonth,
  startOfYear,
  addYears,
  differenceInDays,
  startOfMonth,
  format,
  setDayOfYear,
} from "date-fns";
import { Chart } from "chart.js/auto";
import { getListOfYears } from "../utils/getListOfYears";
import { getWeekLabels } from "../utils/getWeekLabels";

const weekLabels = getWeekLabels();
const years = getListOfYears();
const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const INTERVALS = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

const intervalsOptions = [
  {
    value: INTERVALS.WEEK,
    label: "Last week",
  },
  {
    value: INTERVALS.MONTH,
    label: "Month",
  },
  {
    value: INTERVALS.YEAR,
    label: "Year",
  },
];

const toast = useToast();

const selectedInterval = ref(intervalsOptions[0].value);
const selectedYear = ref(years[0]);
const selectedMonth = ref(months[new Date().getMonth()].value);
const currentData = ref([]);
let moodChart;

const data = {
  datasets: [
    {
      label: "Mood",
      //mood data goes here
      data: currentData.value,
      borderColor: "#f59e0b",
      fill: false,
      tension: 0.5,
      boxWidth: 25,
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
    scales: {
      x: {
        ticks: {
          minRotation: 45,
        },
      },
      y: {
        ticks: {
          min: 0,
          max: 3,
          stepSize: 1,
          //transform numerical data into strings on y-axis
          callback: function (label) {
            switch (label) {
              case 0:
                return "Depressed";
              case 1:
                return "Stressed";
              case 2:
                return "Relaxed";
              case 3:
                return "Motivated";
            }
          },
        },
      },
    },

    plugins: {
      legend: {
        //prevent data hiding when clicking on legend
        onClick: (e) => e.stopPropagation(),
        align: "end",
        labels: {
          boxWidth: 25,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  },
};

const getJournalDayIndex = (journal) => {
  const itemDate = new Date(journal.journalDate);

  if (selectedInterval.value === INTERVALS.WEEK) {
    const dayOfWeek = format(new Date(itemDate), "E");
    const index = weekLabels.indexOf(dayOfWeek);
    return index !== -1 ? index : null;
  } else if (selectedInterval.value === INTERVALS.MONTH) {
    const startDateOfMonth = startOfMonth(
      new Date(selectedYear.value, selectedMonth.value)
    );
    return differenceInDays(itemDate, startDateOfMonth);
  } else if (selectedInterval.value === INTERVALS.YEAR) {
    const startDateOfYear = startOfYear(new Date(selectedYear.value));
    return differenceInDays(itemDate, startDateOfYear);
  }

  return -1;
};

const updateCurrentData = (journals = []) => {
  if (!journals?.length) {
    currentData.value = [];
  }

  const moodMap = {
    DEPRESSED: 0,
    STRESS: 1,
    RELAXED: 2,
    MOTIVATED: 3,
  };
  let moodData = [];

  if (selectedInterval.value === INTERVALS.WEEK) {
    moodData = Array(weekLabels.length).fill(null);
  } else if (selectedInterval.value === INTERVALS.MONTH) {
    const daysInMonth = getDaysInMonth(
      new Date(selectedYear.value, selectedMonth.value)
    );
    moodData = Array(daysInMonth).fill(null);
  } else if (selectedInterval.value === INTERVALS.YEAR) {
    const selectedYearStartDate = startOfYear(new Date(selectedYear.value));
    const nextYearStartDate = startOfYear(
      addYears(new Date(selectedYear.value), 1)
    );

    const daysInSelectedYear = differenceInDays(
      nextYearStartDate,
      selectedYearStartDate
    );
    moodData = Array(daysInSelectedYear).fill(null);
  }

  journals.forEach((item) => {
    const moodMark = moodMap[item.mood];
    if (moodMark !== undefined) {
      const index = getJournalDayIndex(item);
      if (index !== -1) {
        moodData[index] = moodMark;
      }
    }
  });

  currentData.value = moodData;
};

const getMood = async () => {
  const response = await $fetch("/api/journals", {
    params: {
      ...(selectedInterval.value !== INTERVALS.WEEK
        ? { year: selectedYear.value }
        : {}),
      ...(selectedInterval.value === INTERVALS.MONTH
        ? { month: selectedMonth.value }
        : {}),
      ...(selectedInterval.value === INTERVALS.WEEK ? { week: true } : {}),
    },
  }).catch((error) => {
    toast.add({
      title: "Fail to fetch mood data",
      description: error?.data?.message,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  });

  if (response) {
    updateCurrentData(response);
  }
};

watch(selectedMonth, () => {
  getMood();
});

watch(selectedYear, () => {
  getMood();
});

watch(selectedInterval, () => {
  getMood();
});

const updateChart = () => {
  config.data.datasets[0].data = currentData.value;
  if (selectedInterval.value === INTERVALS.WEEK) {
    config.data.labels = weekLabels;
    config.options.scales.x.ticks.callback = (value, index) => {
      return weekLabels[index];
    };
  } else if (selectedInterval.value === INTERVALS.MONTH) {
    config.data.labels = Array.from(
      { length: currentData.value.length },
      (_, i) => ""
    );
    config.options.scales.x.ticks.callback = (val, index) => {
      switch (index) {
        case 6:
          return "Week 1";
        case 13:
          return "Week 2";
        case 20:
          return "Week 3";
        case 27:
          return "Week 4";
      }
    };
  } else if (selectedInterval.value === INTERVALS.YEAR) {
    config.data.labels = Array.from(
      { length: currentData.value.length },
      (_, i) => ""
    );
    const labels = new Map();
    config.options.scales.x.ticks.callback = (val, index) => {
      const date = setDayOfYear(new Date(selectedYear.value, 0), index + 1);
      const formattedMonth = format(date, "MMM");
      if (!labels.has(formattedMonth)) {
        labels.set(formattedMonth, "");
        return formattedMonth;
      }
    };
  }

  moodChart.update();
};

watch(currentData, () => {
  updateChart();
});

onMounted(() => {
  moodChart = new Chart(document.getElementById("myChart"), config);
  getMood();
});

watch(
  () => props.journals,
  () => {
    getMood();
  }
);

const props = defineProps({
  journals: Array,
});
</script>

<template>
  <div class="flex items-center gap-2">
    <USelect
      v-model="selectedInterval"
      :options="intervalsOptions"
      option-attribute="label"
      value-attribute="value"
      color="gray"
      variant="outline"
    />

    <USelect
      v-if="selectedInterval === INTERVALS.MONTH"
      v-model="selectedMonth"
      :options="months"
      option-attribute="label"
      value-attribute="value"
      color="gray"
      variant="outline"
    />

    <USelect
      v-if="
        selectedInterval === INTERVALS.YEAR ||
        selectedInterval === INTERVALS.MONTH
      "
      v-model="selectedYear"
      :options="years"
      color="gray"
      variant="outline"
    />
  </div>

  <div class="w-11/12">
    <canvas id="myChart"></canvas>
  </div>
</template>
