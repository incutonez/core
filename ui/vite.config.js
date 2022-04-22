import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import postcss from "ui/postcss.config.js";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  css: {
    postcss,
  },
  resolve: {
    alias: {
      "ui": path.resolve(path.resolve(), "./src"),
      "shared": path.resolve(path.resolve(), "../shared"),
    },
  },
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "vue-router"],
      input: {
        "CoreUI": "src/core.js",
        "index": "src/index.js",
      },
      output: {
        dir: "dist",
        format: "es",
        entryFileNames: "[name].js",
      },
    },
  },
});
