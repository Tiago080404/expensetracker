import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "bootstrap";
const app = createApp(App);

app.use(ElementPlus);

app.mount("#app");
