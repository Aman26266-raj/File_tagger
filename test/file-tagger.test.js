const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const { addTag, removeTag, searchTags, resolvePath, dbPath } = require("../src/store");

test("add/search/remove tags", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "file-tagger-"));
  const tmpFile = path.join(tmpDir, "example.txt");
  fs.writeFileSync(tmpFile, "hello");

  const resolved = resolvePath(tmpFile);
  addTag(resolved, "team", "alpha");

  let matches = searchTags(tmpDir, "team", "alpha");
  assert.equal(matches.length, 1);
  assert.equal(matches[0].filePath, resolved);

  removeTag(resolved, "team", "alpha");
  matches = searchTags(tmpDir, "team", "alpha");
  assert.equal(matches.length, 0);
});

test("db stored locally", () => {
  assert.ok(dbPath.includes(path.join(os.homedir(), ".file-tagger")));
});
