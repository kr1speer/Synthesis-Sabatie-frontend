import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Локальный сервер разработки поднимается на 3000 порту (методичка, раздел 3).
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
