<script>
import SearchForm from "./components/SearchForm.vue";
import TransactionInput from "./components/TransactionInput.vue";
import CategoryFilter from "./components/CategoryFilter.vue";
import ChartForm from "./components/ChartForm.vue";
import LoginPage from "./components/LoginPage.vue";
import { Timer, Delete, Edit } from "@element-plus/icons-vue";
export default {
  data() {
    return {
      cats: {},
      searchValue: "",
      activeCategoryFilter: [],
      onlyCategories: null,
      isAuthenticated: false,
      currentUser: null,
    };
  },
  components: {
    SearchForm,
    TransactionInput,
    CategoryFilter,
    ChartForm,
    LoginPage,
    Timer,
    Delete,
    Edit,
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
    async getCategoriesDb() {
      try {
        const response = await fetch("http://localhost:8080/categories/all", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        console.log("DB Categories", data);
        this.onlyCategories = data;
      } catch (err) {
        console.log(err);
      }
    },

    async getExpenses() {
      const response = await fetch("http://localhost:8080/expenses/user/2", {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      this.cats = this.chagneDataObj(data);
    },
    chagneDataObj(data) {
      const grouped = {};
      data.forEach((item) => {
        console.log(item.categoryName);
        if (!grouped[item.categoryName]) {
          grouped[item.categoryName] = [];
        }
        grouped[item.categoryName].push({
          name: item.expenseName,
          cost: item.expenseCost,
          date: item.expenseDate,
        });
      });
      console.log(grouped);
      return grouped;
    },
    async checkAuth() {
      try {
        const response = await fetch("http://localhost:8080/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Nicht eingeloggt");

        const userEmail = await response.text();
        this.currentUser = userEmail;
        console.log(this.currentUser);
        this.isAuthenticated = true;
        await this.getExpenses();
        await this.getCategoriesDb();
      } catch (err) {
        console.error("Fehler beim Laden des Benutzers", err);
        this.currentUser = null;
      }
    },
  },
  computed: {
    /*     getOnlyCategories() {
      return Object.keys(this.cats); //das kann vllt gleich raus
    }, */
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
    flatItems() {
      return Object.entries(this.filteredItems).flatMap(
        ([category, transactions]) =>
          transactions.map((transaction) => ({
            ...transaction,
            category,
          }))
      );
    },
  },
  async mounted() {
    await this.getExpenses();
    await this.getCategoriesDb();
  },
  async created() {
    await this.checkAuth();
  },
};
</script>

<template>
  <div v-if="this.isAuthenticated">
    <nav class="navbar rounded" style="background-color: #e3f2fd">
      <div
        class="container-fluid d-flex justify-content-between align-items-center"
      >
        <p class="navbar-brand m-0">Welcome {{ this.currentUser }}</p>

        <div class="position-absolute start-50 translate-middle-x">
          <a class="navbar-brand" href="#">Expense Tracker</a>
        </div>
      </div>
    </nav>

    <SearchForm @search="handleSearch"></SearchForm>
    <TransactionInput
      @categories="updateCategories"
      @newitems="updateItems"
      @newinsert="getExpenses"
      @newCatInsert="getCategoriesDb"
      :categories="onlyCategories"
    ></TransactionInput>
    <CategoryFilter
      :categories="onlyCategories"
      @filter="setCategoryFilter"
    ></CategoryFilter>
    <div class="flex-container">
      <!--   <table
        class="table table-bordered table-striped table-hover table-lg table-responsive w-50 p-3 table-light"
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
      </table> -->
      <div class="table-container">
        <el-table :data="flatItems" style="width: 100%; border-radius: 15px">
          <el-table-column prop="category" label="Category" width="180">
            <template #default="scope">
              <el-button type="primary" style="width: 90px">{{
                scope.row.category
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" width="150" />
          <el-table-column prop="cost" label="Cost" width="150" />
          <el-table-column prop="date" label="Date" width="150">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-icon><Timer /></el-icon>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Edit">
            <el-button>
              <el-icon><Edit /></el-icon>
            </el-button>
          </el-table-column>
          <el-table-column label="Delete">
            <template #default="scope">
              <el-button type="danger"
                ><el-icon><Delete /></el-icon
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ChartForm :categories="cats"></ChartForm>
    </div>
  </div>
  <div v-else>
    <LoginPage @authenticated="this.checkAuth()"></LoginPage>
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
.table-container {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 10px;
}
</style>
