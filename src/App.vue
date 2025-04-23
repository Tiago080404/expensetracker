<script>
import SearchForm from "./components/SearchForm.vue";
import TransactionInput from "./components/TransactionInput.vue";
import CategoryFilter from "./components/CategoryFilter.vue";
import ChartForm from "./components/ChartForm.vue";
export default {
  data() {
    return {
      cats: {},
      searchValue: "",
      activeCategoryFilter: [],
    };
  },
  components: {
    SearchForm,
    TransactionInput,
    CategoryFilter,
    ChartForm,
  },
  methods: {
    updateCategories(newCategories) {
      console.log("received categories:", newCategories);
      this.cats = newCategories;
    },
    updateItems(updatedCategories) {
      console.log("received updated items:", updatedCategories);
      this.cats = updatedCategories;
    },
    handleSearch(search) {
      this.searchValue = search;
    },
    setCategoryFilter(selectedCategories) {
      this.activeCategoryFilter = selectedCategories;
    },
  },
  computed: {
    filteredItems() {
      let filtered = this.cats;

      // Filter by search value if present
      if (this.searchValue) {
        filtered = Object.keys(this.cats).reduce((result, category) => {
          const filteredTransactions = this.cats[category].filter(
            (transaction) =>
              transaction.name
                .toLowerCase()
                .includes(this.searchValue.toLowerCase())
          );
          if (filteredTransactions.length > 0) {
            result[category] = filteredTransactions;
          }
          return result;
        }, {});
      }

      // Filter by selected categories
      if (this.activeCategoryFilter.length > 0) {
        filtered = Object.keys(filtered).reduce((result, category) => {
          if (this.activeCategoryFilter.includes(category)) {
            result[category] = filtered[category];
          }
          return result;
        }, {});
      }

      return filtered;
    },
  },
};
</script>

<template>
  <h1>Expense Tracker</h1>
  <SearchForm @search="handleSearch"></SearchForm>
  <TransactionInput
    @categories="updateCategories"
    @newitems="updateItems"
  ></TransactionInput>
  <CategoryFilter
    :categories="cats"
    @filter="setCategoryFilter"
  ></CategoryFilter>
  <div class="flex-container">
    <table
      class="table table-bordered table-striped table-hover table-lg table-responsive w-50 p-3"
    >
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Name</th>
          <th scope="col">Cost</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(transactions, category) in filteredItems"
          :key="category"
        >
          <tr>
            <td :rowspan="transactions.length + 1">{{ category }}</td>
          </tr>
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.name }}</td>
            <td>{{ transaction.cost }}</td>
            <td>{{ transaction.date }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <ChartForm :categories="cats"></ChartForm>
  </div>
</template>

<style scoped>
h1 {
  display: flex;
  justify-content: center;
}
.container.mt-5 {
  height: 100%;
  width: 100%;
}
.table-lg {
  font-size: 1.2rem;
  padding: 15px;
}
.table {
  width: 100%;
  height: 100%;
}
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}
.chart-container {
  width: 35%;
  height: 50vh;
}
</style>
