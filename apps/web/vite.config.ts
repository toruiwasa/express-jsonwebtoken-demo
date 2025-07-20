import path from "path";
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync("../../certs/key.pem"),
      cert: fs.readFileSync("../../certs/cert.pem"),
    },
  },
}) satisfies UserConfig;
