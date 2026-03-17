#!/usr/bin/env node
/**
 * Example: load and parse root + fragment OpenAPI files across a repo.
 *
 * 1. Discover files: walk the repo for .yaml/.yml/.json (or restrict to paths like openapi/, *.openapi.yaml).
 * 2. Choose grammar: use YAML parser for .yaml/.yml, JSON parser for .json.
 * 3. Parse each file (this script uses the CLI; see below for Node API).
 * 4. Classify: root doc = has top-level "openapi" or "swagger"; everything else = fragment.
 *
 * Node API (when tree-sitter version matches the grammar):
 *   const Parser = require("tree-sitter");
 *   const binding = require("tree-sitter-openapi");
 *   const yamlParser = new Parser(); yamlParser.setLanguage(binding);
 *   const jsonParser = new Parser(); jsonParser.setLanguage(binding.openapi_json);
 *   const tree = (isJson ? jsonParser : yamlParser).parse(source);
 *   // Walk tree.rootNode to find keys, $refs, etc.
 *
 * Usage: node examples/parse-openapi-repo.js [repo-dir]
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const YAML_GRAMMAR = path.join(REPO_ROOT, "tree-sitter-openapi");
const JSON_GRAMMAR = path.join(REPO_ROOT, "tree-sitter-openapi-json");

function findOpenApiFiles(dir, files = [], base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      findOpenApiFiles(full, files, base);
    } else if (e.isFile() && /\.(yaml|yml|json)$/i.test(e.name)) {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function isRootDocument(source, isJson) {
  const line = source.split(/\n/)[0] || "";
  return /^\s*["']?(openapi|swagger)["']?\s*[:=]/.test(line) || (isJson && /^\s*\{\s*["'](openapi|swagger)["']\s*:/.test(source));
}

function parseWithCli(grammarDir, filePath) {
  try {
    execSync(`tree-sitter parse --quiet "${filePath}"`, {
      encoding: "utf8",
      cwd: grammarDir,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, stderr: err.stderr };
  }
}

function main() {
  const repoDir = path.resolve(process.argv[2] || ".");
  const files = findOpenApiFiles(repoDir);
  const results = files.map((relPath) => {
    const fullPath = path.join(repoDir, relPath);
    const source = fs.readFileSync(fullPath, "utf8");
    const isJson = /\.json$/i.test(relPath);
    const grammarDir = isJson ? JSON_GRAMMAR : YAML_GRAMMAR;
    const parseResult = parseWithCli(grammarDir, fullPath);
    const root = isRootDocument(source, isJson);
    return { relPath, root, isJson, parseOk: parseResult.ok };
  });

  const roots = results.filter((r) => r.root);
  const fragments = results.filter((r) => !r.root);

  console.log("OpenAPI files parsed:", results.length);
  console.log("  Roots (openapi/swagger):", roots.map((r) => r.relPath).join(", ") || "(none)");
  console.log("  Fragments:", fragments.map((r) => r.relPath).join(", ") || "(none)");
  results.forEach((r) => console.log("   ", r.relPath, "| root:", r.root, "| parse:", r.parseOk ? "ok" : "fail"));
}

main();
