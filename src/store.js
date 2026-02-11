const fs = require("fs");
const path = require("path");
const os = require("os");

const baseDir = path.join(os.homedir(), ".file-tagger");
const dbPath = path.join(baseDir, "db.json");

function ensureBaseDir() {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
}

function loadDb() {
  ensureBaseDir();
  if (!fs.existsSync(dbPath)) {
    return { version: 1, files: {}, updatedAt: new Date().toISOString() };
  }

  const raw = fs.readFileSync(dbPath, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.files || typeof parsed.files !== "object") {
      return { version: 1, files: {}, updatedAt: new Date().toISOString() };
    }
    return parsed;
  } catch (error) {
    return { version: 1, files: {}, updatedAt: new Date().toISOString() };
  }
}

function saveDb(db) {
  ensureBaseDir();
  db.updatedAt = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function resolvePath(inputPath) {
  return path.resolve(process.cwd(), inputPath);
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
}

function addTag(filePath, key, value) {
  if (!fileExists(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const db = loadDb();
  if (!db.files[filePath]) {
    db.files[filePath] = {};
  }
  db.files[filePath][key] = value;
  saveDb(db);
}

function removeTag(filePath, key, value) {
  const db = loadDb();
  if (!db.files[filePath]) {
    return false;
  }

  if (value === "*" || db.files[filePath][key] === value) {
    delete db.files[filePath][key];
  }

  if (Object.keys(db.files[filePath]).length === 0) {
    delete db.files[filePath];
  }

  saveDb(db);
  return true;
}

function isUnderRoot(filePath, rootPath) {
  if (!rootPath) {
    return true;
  }

  const resolvedRoot = resolvePath(rootPath);
  if (!fs.existsSync(resolvedRoot)) {
    throw new Error(`Path not found: ${resolvedRoot}`);
  }

  const stat = fs.lstatSync(resolvedRoot);
  if (stat.isFile()) {
    return filePath === resolvedRoot;
  }

  const normalizedRoot = resolvedRoot.endsWith(path.sep)
    ? resolvedRoot
    : `${resolvedRoot}${path.sep}`;
  return filePath === resolvedRoot || filePath.startsWith(normalizedRoot);
}

function searchTags(rootPath, key, value) {
  const db = loadDb();
  const matches = [];

  for (const [filePath, tags] of Object.entries(db.files)) {
    if (!isUnderRoot(filePath, rootPath)) {
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(tags, key)) {
      continue;
    }

    if (value === "*" || tags[key] === value) {
      matches.push({ filePath, key, value: tags[key] });
    }
  }

  return matches;
}

function listAllTags() {
  const db = loadDb();
  return db.files;
}

module.exports = {
  addTag,
  removeTag,
  searchTags,
  listAllTags,
  resolvePath,
  fileExists,
  dbPath
};
