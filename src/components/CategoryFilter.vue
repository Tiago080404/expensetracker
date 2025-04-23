<script>
export default {
  data() {
    return {
      selectedCategories: [],
    };
  },
  props: {
    categories: Object,
  },
  methods: {
    checkProps() {
      console.log(this.categories);
    },
    categoryFilter(category) {
      if (this.selectedCategories.includes(category)) {
        this.selectedCategories = this.selectedCategories.filter(
          (item) => item !== category
        );
        console.log("unselected:", this.selectedCategories);
      } else {
        this.selectedCategories.push(category);
        console.log("selected:", this.selectedCategories);
      }
      this.$emit("filter", this.selectedCategories);
    },
  },
};
</script>
<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-primary dropdown-toggle"
      type="button"
      id="dropDownMenuButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      @click="checkProps"
    >
      Categories
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li>
        <div
          class="form-check category-item"
          :class="{
            'selected-category': selectedCategories.includes(category),
          }"
          v-for="(item, category) in categories"
          @click="categoryFilter(category)"
        >
          {{ category }}
        </div>
      </li>
    </ul>
  </div>
</template>
<style>
.category-item {
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}
.category-item:hover {
  background-color: lightgray;
}
.selected-category {
  background-color: aqua;
}
</style>
