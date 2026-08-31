import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      "react-icons",
      "react-icons/fa",
      "react-icons/md",
      "react-icons/bs",
      "react-icons/fi",
      "react-icons/ai",
    ],
    exclude: [],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-icons')) {
            return 'react-icons';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
