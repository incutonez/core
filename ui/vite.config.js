import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import postcss from "./postcss.config.js";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [vue(), cssInjectedByJsPlugin()],
    css: {
      postcss,
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
    resolve: {
      alias: {
        "ui": path.resolve(path.resolve(), "./src"),
        "shared": path.resolve(path.resolve(), "../shared"),
      },
    },
  };
  if (mode === "GitHubPages") {
    baseConfig.build = {
      rollupOptions: {
        output: {
          dir: "docs",
        },
      },
    };
  }
  else {
    baseConfig.build = {
      lib: {
        entry: "src/index.js",
        formats: ["es"],
      },
      rollupOptions: {
        external: ["vue", "vue-router"],
        input: {
          "CoreUI": "src/core.js",
          "index": "src/index.js",
          "tailwind.config": "tailwind.config.js",
        },
        output: {
          dir: "dist",
          format: "es",
          entryFileNames: "[name].js",
        },
      },
    };
  }
  baseConfig.build.emptyOutDir = false;
  return baseConfig;
});
