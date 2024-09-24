import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    outDir: "./build"
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "src/styles/variables.scss";'
      }
    }
  }
});
