<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      chart: null,
    };
  },
  props: {
    categories: Object,
  },
  methods: {
    createChart() {
      const ctx = document.getElementById("myChart").getContext("2d");

      const data = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Spendings",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
            ],
            data: this.monthlyCosts,
            borderWidth: 1,
          },
        ],
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "left",
            },
          },
        },
      });
    },
    checkProps() {
      console.log("Prop cats data", this.categories);
      let MonthCosts = new Array(12).fill(0);
      for (let category in this.categories) {
        console.log(category);
        for (let item of this.categories[category]) {
          console.log("daten:", item);
          let rightMonth = new Date(item.date).getMonth();
          console.log("monate:", rightMonth);
          MonthCosts[rightMonth] += parseFloat(item.cost);
        }
      }
      console.log("monthly spendings:", MonthCosts);
      return MonthCosts;
    },
  },
  computed: {
    monthlyCosts() {
      console.log("Prop cats data", this.categories);
      let MonthCosts = new Array(12).fill(0);
      for (let category in this.categories) {
        console.log(category);
        for (let item of this.categories[category]) {
          console.log("daten:", item);
          let rightMonth = new Date(item.date).getMonth();
          console.log("monate:", rightMonth);
          MonthCosts[rightMonth] += parseFloat(item.cost);
        }
      }
      console.log("monthly spendings:", MonthCosts);
      return MonthCosts;
    },
  },
  watch: {
    // Wenn sich die Kategorien ändern, aktualisiere die Chart
    categories: {
      handler(newVal) {
        this.createChart(this.monthlyCosts);
      },
      deep: true, // Reagiert auf Änderungen innerhalb des Objekts
    },
  },
  mounted() {
    this.createChart(this.monthlyCosts);
  },
};
</script>

<template>
  <!-- <div><button @click="checkProps">fafsa</button></div> -->

  <div class="chart-container">
    <canvas id="myChart"></canvas>
  </div>
</template>
<style scoped>
.chart-container {
  width: 50vh;
  height: 80vh;
  position: relative;
}
#myChart {
  width: 100%;
  height: 100%;
}
</style>
