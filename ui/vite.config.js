import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import postcss from "./postcss.config.js";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [vue()],
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
      },
    },
    test: {
      globals: true,
    },
  };
  if (mode === "GitHubPages") {
    baseConfig.base = "/core/";
    baseConfig.build = {
      cssCodeSplit: false,
      assetsInlineLimit: 100000,
      assetsDir: ".",
      rollupOptions: {
        output: {
          dir: "docs",
        },
      },
    };
  }
  else {
    baseConfig.plugins.push(cssInjectedByJsPlugin());
    baseConfig.build = {
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
      },
      rollupOptions: {
        external: ["vue", "vue-router"],
        input: {
          "CoreUI": "src/core.ts",
          "index": "src/index.ts",
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
