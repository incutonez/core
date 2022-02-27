import { createApp } from "vue";
import "ui/index.css";
import "shared/overrides/Date.js";
import "ui/rules.js";
import App from "ui/App.vue";

const app = createApp(App);
app.mount("#app");
