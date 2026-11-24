import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";
import { defineConfig, type ProxyOptions } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const PAGES_BASE = "/Synthesis-Sabatie-frontend/";

const CERT_KEY = new URL("./cert/cert.key", import.meta.url);
const CERT_CRT = new URL("./cert/cert.crt", import.meta.url);
const hasLocalCert = existsSync(CERT_KEY) && existsSync(CERT_CRT);

const backendProxy: Record<string, ProxyOptions> = {
  "/api": {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
  },
  "/s3": {
    target: "http://127.0.0.1:9000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/s3/, ""),
  },
};

export default defineConfig(({ mode }) => {
  const base = mode === "pages" ? PAGES_BASE : "/";

  return {
    base,
    plugins: [
      react(),
      ...(hasLocalCert ? [] : [basicSsl()]),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: false,
        devOptions: {
          enabled: true,
        },
        includeAssets: ["apple-touch-icon.png", "default_material.png"],
        manifest: {
          name: "Синтез метана Сабатье",
          short_name: "Сабатье",
          description: "Каталог и лента материалов реакции Сабатье",
          lang: "ru",
          start_url: base,
          scope: base,
          display: "standalone",
          orientation: "portrait-primary",
          background_color: "#f2f2fd",
          theme_color: "#00349b",
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,jpeg,jpg,svg,ico,webmanifest}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/api/, /^\/s3/],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "video",
              handler: "CacheFirst",
              options: {
                cacheName: "material-videos",
                rangeRequests: true,
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 20 },
              },
            },
          ],
        },
      }),
    ],
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      https: hasLocalCert
        ? { key: readFileSync(CERT_KEY), cert: readFileSync(CERT_CRT) }
        : undefined,
      proxy: backendProxy,
    },
    preview: {
      port: 4173,
      host: true,
      proxy: backendProxy,
    },
  };
});
