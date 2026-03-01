#!/usr/bin/env node

// Blocks `npm install` by default to protect package-lock.json.
// Allows `npm ci` and all other commands.
// Allows `npm install ...` only when ALLOW_NPM_INSTALL=1 is set
// (which your `npm run add:dep` helper does for you).

try {
    const cmd = process.env.npm_command;
    const allowInstall = process.env.ALLOW_NPM_INSTALL === "1";
  
    // If npm didn't set a command, don't block anything.
    if (!cmd) {
      process.exit(0);
    }
  
    // Block ALL `npm install` unless explicitly allowed via ALLOW_NPM_INSTALL=1.
    if (cmd === "install" && !allowInstall) {
      console.error(
        "\n`npm install` is disabled for this project by default.\n" +
          "   It can rewrite package-lock.json differently on each machine and cause merge conflicts.\n\n" +
          "   Normal usage (most of the time):\n" +
          "     `npm ci`\n" +
          "   to install dependencies from the existing lockfile.\n\n" +
          "   To intentionally add or update dependencies, use:\n" +
          "     npm run add:dep -- <package> [more] [--save-dev]\n\n" +
          "   Examples:\n" +
          "     `npm run add:dep -- axios`\n" +
          "     `npm run add:dep -- vitest --save-dev`\n"
      );
      process.exit(1);
    }
  
    // Otherwise (npm ci, npm test, add:dep-installed child, etc.), allow.
    process.exit(0);
  } catch (_err) {
    // If anything goes weird, fail open instead of bricking installs completely.
    process.exit(0);
  }
  