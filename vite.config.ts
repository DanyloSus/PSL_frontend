import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      pwaAssets: {
        image: "public/favicon.svg"
      },
      manifest: {
        name: "PSL — Personal Stat Log",
        short_name: "PSL",
        description: "Personal stat tracker built for the growth obsessed.",
        theme_color: "#d6ff00",
        background_color: "#05060a",
        display: "standalone",
        start_url: ".",
        scope: "."
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "index.html"
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  optimizeDeps: {
    exclude: ["fsevents"]
  },
  build: {
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      external: ["fs/promises"]
    }
  },
  resolve: {
    tsconfigPaths: true
  },
  test: {
    coverage: {
      include: ["src/**"]
    },
    projects: [
      {
        extends: true,
        test: {
          globals: true,
          environment: "jsdom",
          setupFiles: "./src/testing/setup-tests.ts",
          exclude: ["**/node_modules/**", "**/e2e/**"]
        }
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook")
          })
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium"
              }
            ]
          }
        }
      }
    ]
  }
});
