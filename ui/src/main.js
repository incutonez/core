import { createApp } from "vue";
import core from "ui/core.js";
import App from "ui/App.vue";

const app = createApp(App);
app.use(core);
app.mount("#app");
