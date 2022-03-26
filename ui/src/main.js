import { createApp } from "vue";
import "ui/index.css";
import "shared/overrides/Date.js";
import "ui/rules.js";
import App from "ui/App.vue";
import core from "ui/core.js";

const app = createApp(App);
app.use(core);
app.mount("#app");
