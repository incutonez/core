import { createApp } from "vue";
import core from "ui/core.js";
import App from "ui/App.vue";
import {
  clickDocument,
  scrollDocument,
} from "ui/directives/document.js";

const app = createApp(App);
app.use(core);
app.directive("click-document", clickDocument);
app.directive("scroll-document", scrollDocument);
app.mount("#app");
