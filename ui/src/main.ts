import { createApp } from "vue";
import core from "ui/core";
import App from "ui/App.vue";
import { Router } from "ui/Router";
import "material-icons/iconfont/outlined.css";

const app = createApp(App);
app.use(core);
app.use(Router);
app.mount("#app");
