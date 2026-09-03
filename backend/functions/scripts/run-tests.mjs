import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (args.length > 0) {
  // Testes focados não devem repassar argumentos ao Firebase CLI.
  run("jest", ["--testPathIgnorePatterns=/tests/security/", ...args]);
  process.exit(0);
}

run("npm", ["run", "test:unit"]);
run("npm", ["run", "test:rules"]);
