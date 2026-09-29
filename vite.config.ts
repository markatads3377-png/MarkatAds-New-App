import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure production mode during build commands to prevent jsx-dev runtime leaks in server bundles
if (!process.env.NODE_ENV && process.env.npm_lifecycle_event !== "dev") {
  process.env.NODE_ENV = "production";
}

// Determine target preset:
// Cloudflare Pages / Workers: CF_PAGES, CLOUDFLARE_PAGES, CLOUDFLARE_WORKERS
// Vercel: VERCEL
// Default for Cloud Run, Docker, and standard Node runtime: "node-server"
const nitroPreset =
  process.env.NITRO_PRESET ||
  (process.env.CF_PAGES || process.env.CLOUDFLARE_PAGES
    ? "cloudflare-pages"
    : process.env.CLOUDFLARE_WORKERS
      ? "cloudflare-module"
      : process.env.VERCEL
        ? "vercel"
        : "node-server");

export default defineConfig({
  server: {
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      preset: nitroPreset,
    }),
    viteReact(),
  ],
});
