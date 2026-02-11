const { addTag, removeTag, searchTags, resolvePath } = require("./store");
const { startUi } = require("./ui");

function printUsage() {
  console.log("Usage:");
  console.log("  file-tagger add <path> <key>=<value>");
  console.log("  file-tagger remove <path> <key>=<value>");
  console.log("  file-tagger search <path|.> <key>=<value>");
  console.log("  file-tagger ui [--port 5173]");
}

function parseTagArg(tagArg) {
  const idx = tagArg.indexOf("=");
  if (idx === -1) {
    throw new Error("Tag must be in key=value format.");
  }

  const key = tagArg.slice(0, idx).trim();
  const value = tagArg.slice(idx + 1).trim();
  if (!key || !value) {
    throw new Error("Tag key and value are required.");
  }

  return { key, value };
}

function parsePort(args) {
  const idx = args.indexOf("--port");
  if (idx === -1) {
    return 5173;
  }

  const val = args[idx + 1];
  const port = Number(val);
  if (!Number.isInteger(port)) {
    throw new Error("Port must be a number.");
  }
  return port;
}

function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    printUsage();
    process.exit(1);
  }

  if (command === "ui") {
    const port = parsePort(args);
    startUi({ port });
    return;
  }

  if (args.length < 2) {
    printUsage();
    process.exit(1);
  }

  const targetPath = resolvePath(args[0]);
  const { key, value } = parseTagArg(args[1]);

  try {
    if (command === "add") {
      addTag(targetPath, key, value);
      console.log(`Added ${key}=${value} to ${targetPath}`);
      return;
    }

    if (command === "remove") {
      removeTag(targetPath, key, value);
      console.log(`Removed ${key}=${value} from ${targetPath}`);
      return;
    }

    if (command === "search") {
      const matches = searchTags(targetPath, key, value);
      if (!matches.length) {
        console.log("No matches found.");
        return;
      }

      for (const match of matches) {
        console.log(`${match.filePath} ${match.key}=${match.value}`);
      }
      return;
    }

    printUsage();
    process.exit(1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
