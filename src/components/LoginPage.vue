<template>
  <input type="text" placeholder="email" v-model="userEmail" />
  <input type="text" placeholder="password" v-model="userPassword" />
  <button @click="login">Login</button>
</template>
<script>
export default {
  data() {
    return {
      userEmail: "",
      userPassword: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: "tiago@example.com",
            password: "meinPasswort123",
          }),
        });
        const data = await response.json();
        console.log(data);
        this.$emit("authenticated");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style></style>
