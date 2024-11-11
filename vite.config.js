import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "http://localhost:3000/",
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
