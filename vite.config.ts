import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/lokesh-portfolio/",
  },

  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});
