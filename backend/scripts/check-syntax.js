const { readdirSync, statSync } = require("node:fs");
const { join, relative } = require("node:path");
const { spawnSync } = require("node:child_process");

const root = join(__dirname, "..");
const targets = [join(root, "server.js"), join(root, "seed.js"), join(root, "scripts"), join(root, "src")];

const collect = (path) => {
  if (!statSync(path).isDirectory()) return path.endsWith(".js") ? [path] : [];
  return readdirSync(path).flatMap((name) => collect(join(path, name)));
};

const files = [...new Set(targets.flatMap(collect))];
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`Syntax check passed for ${files.length} backend files.`);
