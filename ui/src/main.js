import { createApp } from "vue";
import core from "ui/core.js";
import App from "ui/App.vue";
import {
  clickDocument,
  scrollDocument,
} from "ui/directives/document.js";
import { Router } from "ui/Router.js";

const app = createApp(App);
app.use(core);
app.use(Router);
app.directive("click-document", clickDocument);
app.directive("scroll-document", scrollDocument);
app.mount("#app");
