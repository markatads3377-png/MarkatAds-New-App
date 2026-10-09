import fs from 'fs';
import path from 'path';

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (path.resolve(src) === path.resolve(dest)) return;
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

// 1. Sync static assets to all known Cloudflare & Pages output targets
const targets = ['.output/public', 'build/client', 'build'];
for (const target of targets) {
  copyRecursive('dist', target);
}

// 2. Sync worker entry point
if (!fs.existsSync('.output/server')) {
  fs.mkdirSync('.output/server', { recursive: true });
}
if (fs.existsSync('worker.js')) {
  fs.copyFileSync('worker.js', '.output/server/index.mjs');
}

console.log('[build-sync] Mirrored production output across dist, .output, and build');
