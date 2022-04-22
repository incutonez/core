import { createApp } from "vue";
import core from "ui/core.js";
import App from "ui/App.vue";
import { Router } from "ui/Router.js";

const app = createApp(App);
app.use(core);
app.use(Router);
app.mount("#app");
