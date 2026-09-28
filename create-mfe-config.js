import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, "mfe-config.json");

const config = {
  name: "markat-ads",
  version: "1.0.0",
  remotes: [],
  shared: {},
};

fs.writeFileSync(targetPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
console.log(`Successfully created ${targetPath}`);
