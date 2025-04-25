<script>
export default {
  data() {
    return {
      itemName: "",
      dateItem: "",
      itemCost: "",
      itemCategory: "",
      newCategoryName: "",
      selectedCategory: null,
      newExpense: {
        categories: {
          fun: [],
          car: [],
          food: [],
        },
      },
    };
  },
  methods: {
    addCategory() {
      console.log(this.newExpense.categories);
      this.newExpense.categories = {
        ...this.newExpense.categories,
        [this.newCategoryName]: [],
      };
      console.log("new cats:", this.newExpense.categories);
      this.$emit("categories", this.newExpense.categories);
      this.newCategoryName = "";
    },
    addItem() {
      this.newExpense.categories[this.itemCategory].push({
        name: this.itemName,
        cost: this.itemCost,
        date: this.dateItem,
      });
      this.$emit("newitems", this.newExpense.categories);
    },
    async tryAddDb() {
      console.log(this.itemCategory);
      const response = await fetch(
        `http://localhost:8080/categories/${this.itemCategory}`,
        {
          method: "GET",
          "Content-type": "application/json",
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data[0].id);
      const categoryId = data[0].id;
      //hier dann den insert machen mit der id
      await this.insertInDb(categoryId);
    },
    async insertInDb(categoryId) {
      console.log(this.dateItem);
      const response = await fetch("http://localhost:8080/expenses", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          expenseName: this.itemName,
          expenseDate: this.dateItem,
          byUser: {
            id: 2, //das funktioniert erst mit user auth
          },
          category: {
            id: categoryId,
          },
        }),
      });
      const data = await response.json();
      console.log(data);
    },
  },
};
</script>
<template>
  <div class="bobob">
    <div class="other">
      <input
        v-model="newCategoryName"
        type="text"
        class="form-control"
        placeholder="enter categoory"
      />
      <button @click="addCategory" class="btn btn-primary" id="categorybtn">
        Add Category
      </button>
    </div>

    <label class="form-label">
      <div id="item-input">
        <input
          class="form-control"
          v-model="itemName"
          type="text"
          placeholder="Item"
        />
      </div>
      <div id="cost-input">
        <input
          class="form-control"
          v-model="itemCost"
          type="number"
          placeholder="cost"
        />
      </div>
      <div id="date-input">
        <input class="form-control" v-model="dateItem" type="date" />
      </div>

      <select
        v-model="itemCategory"
        class="form-select"
        aria-label="Default select example"
        id="category-select"
      >
        <option v-for="(name, key) in this.newExpense.categories" :key="key">
          {{ key }}
        </option>
      </select>

      <button @click="addItem" class="btn btn-outline-primary" id="add-btn">
        Add Expense
      </button>
      <button @click="tryAddDb">add</button>
    </label>
  </div>
</template>
<style>
.bobob {
  display: flex;
  justify-content: start;
  margin: 5px;
  position: relative;
}
.other {
  position: absolute;
  right: 13px;
  margin-right: -13px;
}
#categorybtn {
  position: relative;
  top: -40px;
  right: 125px;
}

#cost-input {
  position: relative;
  left: 240px;
  bottom: 38px;
}
#date-input {
  position: relative;
  bottom: 30px;
}
#category-select {
  position: relative;
  bottom: 68px;
  left: 240px;
}
#add-btn {
  position: relative;
  bottom: 56px;
}
</style>
