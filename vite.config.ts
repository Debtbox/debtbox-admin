import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  // Use /debtbox-admin/ for GitHub Pages subdirectory deployment
  // When custom domain (admin.debtbox.sa) is configured, change this to '/'
  base: process.env.VITE_BASE_PATH || '/debtbox-admin/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
