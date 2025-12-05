#!/usr/bin/env node

// Helper script to intentionally install dependencies in a controlled way.
// Usage (from repo root):
//   npm run add:dep -- <package> [more] [--save-dev]
//   npm run add:dep:client -- <package> [more] [--save-dev]
//   npm run add:dep:server -- <package> [more] [--save-dev]
//
// This sets ALLOW_NPM_INSTALL=1 for the child `npm install`, so the
// preinstall hook will allow it even in client/server.

const { spawn } = require("node:child_process");
const path = require("node:path");

// first arg is the target directory (passed from package.json script)
const targetDir = process.argv[2];
// remaining args are the actual npm install arguments
const installArgs = process.argv.slice(3);

if (!targetDir) {
  console.error(
    "\nMissing target directory.\n" +
      "This script is intended to be called from npm scripts like:\n" +
      "  npm run add:dep -- <pkg>\n" +
      "  npm run add:dep:client -- <pkg>\n" +
      "  npm run add:dep:server -- <pkg>\n"
  );
  process.exit(1);
}

if (installArgs.length === 0) {
  console.error(
    "\nUsage:\n" +
      "  npm run add:dep -- <package> [more] [--save-dev]\n" +
      "  npm run add:dep:client -- <package> [more] [--save-dev]\n" +
      "  npm run add:dep:server -- <package> [more] [--save-dev]\n\n" +
      "Examples:\n" +
      "  npm run add:dep:client -- react-icons\n" +
      "  npm run add:dep:client -- @testing-library/user-event --save-dev\n" +
      "  npm run add:dep:server -- supertest --save-dev\n"
  );
  process.exit(1);
}

// resolve the working directory: ".", "client", or "server"
const cwd = path.resolve(__dirname, "..", targetDir);

// build a single shell command: npm install <args...>
const installCommand = `npm install ${installArgs.join(" ")}`;

console.log(`\nInstalling in: ${cwd}`);
console.log(`Running: ${installCommand}\n`);

// run via the shell so npm resolves correctly on Windows/macOS/Linux
const child = spawn(installCommand, {
  cwd,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    ALLOW_NPM_INSTALL: "1",
  },
});

child.on("error", (err) => {
  console.error("\nError running npm:", err.message);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
