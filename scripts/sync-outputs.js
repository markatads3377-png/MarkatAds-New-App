import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import http from "http";

// 1. Create target directories
const targetDirs = ["build", "build/client", "build/server", "dist"];
for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 2. Identify source directories
const staticSources = [".vercel/output/static", ".output/public"].filter((dir) =>
  fs.existsSync(dir),
);

const serverSources = [".vercel/output/functions/__server.func", ".output/server"].filter((dir) =>
  fs.existsSync(dir),
);

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy static assets to build, build/client, dist, and .vercel/output/static if present
for (const src of staticSources) {
  copyRecursive(src, "build/client");
  copyRecursive(src, "build");
  copyRecursive(src, "dist");
  if (fs.existsSync(".vercel/output") && src !== ".vercel/output/static") {
    copyRecursive(src, ".vercel/output/static");
  }
}

// Copy server bundle to build/server
for (const src of serverSources) {
  copyRecursive(src, "build/server");
}

// 3. Attempt to pre-render the real homepage HTML from the SSR server
async function fetchPrerenderedHtml() {
  const serverPath = fs.existsSync(".output/server/index.mjs")
    ? ".output/server/index.mjs"
    : fs.existsSync(".vercel/output/functions/__server.func/index.mjs")
      ? ".vercel/output/functions/__server.func/index.mjs"
      : null;

  if (!serverPath) return null;

  const testPort = 44921;
  const child = spawn("node", [serverPath], {
    env: { ...process.env, PORT: String(testPort), NODE_ENV: "production" },
    stdio: "ignore",
  });

  try {
    for (let i = 0; i < 35; i++) {
      await new Promise((r) => setTimeout(r, 150));
      try {
        const html = await new Promise((resolve, reject) => {
          const req = http.get(`http://127.0.0.1:${testPort}/`, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data));
          });
          req.on("error", reject);
          req.setTimeout(1000, () => {
            req.destroy();
            reject(new Error("Timeout"));
          });
        });

        if (html && html.includes("Mark@Ads")) {
          child.kill();
          return html;
        }
      } catch {
        // Server not ready yet, continue polling
      }
    }
  } catch (err) {
    console.warn("[sync-outputs] SSR prerender probe error:", err.message);
  } finally {
    child.kill();
  }

  return null;
}

// 4. Generate fallback HTML if SSR probe is not available
function generateFallbackHtml() {
  let mainJs = "";
  let mainCss = "";
  const searchDirs = [
    "build/client/assets",
    "build/assets",
    "dist/assets",
    ".output/public/assets",
  ];
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (f.startsWith("index-") && f.endsWith(".js")) mainJs = `/assets/${f}`;
        if (f.startsWith("styles-") && f.endsWith(".css")) mainCss = `/assets/${f}`;
      }
      if (mainJs) break;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mark@Ads — Buy & sell advertising media</title>
    <meta name="description" content="The global marketplace for buying and selling advertising media." />
    <meta property="og:title" content="Mark@Ads — Buy & sell advertising media" />
    <meta property="og:description" content="Buy and sell billboards, screens, transit and event advertising media." />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap" />
    ${mainCss ? `<link rel="stylesheet" href="${mainCss}" />` : ""}
  </head>
  <body>
    <div id="root">
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; background: #fafafa; color: #111;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600;">Mark@Ads</h1>
          <p style="color: #666; margin-bottom: 1.5rem;">Loading advertising media marketplace...</p>
        </div>
      </div>
    </div>
    ${mainJs ? `<script type="module" async src="${mainJs}"></script>` : ""}
  </body>
</html>`;
}

async function run() {
  console.log("[sync-outputs] Synchronizing static and server outputs...");

  const prerenderedHtml = await fetchPrerenderedHtml();
  const finalHtml = prerenderedHtml || generateFallbackHtml();

  if (prerenderedHtml) {
    console.log(
      `[sync-outputs] Prerendered SSR HTML generated successfully (${finalHtml.length} bytes).`,
    );
  } else {
    console.log("[sync-outputs] Using styled static fallback HTML shell.");
  }

  // List of all destinations that need index.html
  const htmlDestinations = [
    "build/index.html",
    "build/200.html",
    "build/404.html",
    "build/client/index.html",
    "build/client/200.html",
    "build/client/404.html",
    "dist/index.html",
    "dist/200.html",
    "dist/404.html",
    ".output/public/index.html",
    ".output/public/200.html",
    ".output/public/404.html",
  ];

  if (fs.existsSync(".vercel/output/static")) {
    htmlDestinations.push(".vercel/output/static/index.html");
    htmlDestinations.push(".vercel/output/static/200.html");
    htmlDestinations.push(".vercel/output/static/404.html");
  }

  for (const dest of htmlDestinations) {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    fs.writeFileSync(dest, finalHtml, "utf-8");
  }

  console.log(
    `[sync-outputs] Successfully wrote index.html and SPA fallback files across all target directories.`,
  );
}

run().catch((err) => {
  console.error("[sync-outputs] Error during sync:", err);
  process.exit(1);
});
