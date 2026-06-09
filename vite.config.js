import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      tailwindcss(),
      Icons({
        compiler: "vue3",
        autoInstall: true,
      }),
    ],

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },

    server: {
      port: 5173,
      host: true,
      proxy: {
        "/files": {
          target: env.VITE_API_URL || "http://127.0.0.1:8787",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/files/, ""),
        },
      },
    },

    build: {
      target: "esnext",
      minify: "esbuild",
      emptyOutDir: true,
      reportCompressedSize: false,
      cssCodeSplit: true,
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("vue") ||
                id.includes("pinia") ||
                id.includes("vue-router")
              ) {
                return "vendor-core";
              }
              if (id.includes("chart.js") || id.includes("lodash")) {
                return "vendor-heavy";
              }
              return "vendor-libs";
            }
          },
        },
      },
    },

    test: {
      environment: "happy-dom",
      globals: true,
      include: ["src/tests/**/*.test.ts"],
      exclude: ["saku/**"],
      setupFiles: ["src/tests/setup.ts"],
    },
  };
});
