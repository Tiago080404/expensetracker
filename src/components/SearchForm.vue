<script>
export default {
  data() {
    return {};
  },
  emits: ["search"],
  methods: {
    search(e) {
      this.$emit("search", e.target.value);
    },
  },
};
</script>
<template>
  <input
    type="text"
    placeholder="search"
    class="form-control form-control-sm w-auto"
    @input="search"
  />
</template>
