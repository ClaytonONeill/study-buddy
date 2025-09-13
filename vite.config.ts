import { defineConfig } from "vite";
import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
});

const testConfig = defineTestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});

export default mergeConfig(viteConfig, testConfig);
