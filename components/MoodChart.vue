<script setup>
Chart.defaults.color = "#78716c";

import { Chart } from "chart.js/auto";
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Mood",
      //mood data goes here
      data: [3, 2, 2, 1, 3, 1, 0],
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

onMounted(() => {
  const myChart = new Chart(document.getElementById("myChart"), config);
});
</script>

<template>
  <div class="w-11/12">
    <canvas id="myChart"></canvas>
  </div>
</template>
