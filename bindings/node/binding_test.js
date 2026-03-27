const assert = require("node:assert");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

test("binding exports openapi (YAML) language", () => {
  const binding = require(".");
  assert.ok(binding, "binding loads");
  assert.ok(binding.name === "openapi", "binding.name is openapi");
  assert.ok(binding.language, "binding.language (YAML parser) is set");
});

test("binding exports openapi_json language", () => {
  const binding = require(".");
  assert.ok(binding.openapi_json, "binding.openapi_json is set");
  assert.ok(binding.openapi_json.name === "openapi_json", "openapi_json.name");
  assert.ok(binding.openapi_json.language, "openapi_json.language (JSON parser) is set");
});

function assertCliParses(grammarDir, filename, content) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tree-sitter-openapi-"));
  const filePath = path.join(tmpDir, filename);
  fs.writeFileSync(filePath, content);
  execFileSync("npx", ["tree-sitter", "parse", "--quiet", filePath], {
    cwd: grammarDir,
    stdio: "pipe",
  });
}

test("binding repo parses OpenAPI YAML fixture with CLI grammar", () => {
  const repoRoot = path.join(__dirname, "..", "..");
  assertCliParses(
    path.join(repoRoot, "tree-sitter-openapi"),
    "openapi.yaml",
    `openapi: "3.1.0"
info:
  title: Example
  version: "1.0.0"
paths: {}
`
  );
});

test("binding repo parses OpenAPI JSON fixture with CLI grammar", () => {
  const repoRoot = path.join(__dirname, "..", "..");
  assertCliParses(
    path.join(repoRoot, "tree-sitter-openapi-json"),
    "openapi.json",
    `{
  "openapi": "3.1.0",
  "info": {
    "title": "Example",
    "version": "1.0.0"
  },
  "paths": {}
}`
  );
});
