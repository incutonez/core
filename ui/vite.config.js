import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "ui": path.resolve(path.resolve(), "./src"),
      "shared": path.resolve(path.resolve(), "../shared"),
    },
  },
});
