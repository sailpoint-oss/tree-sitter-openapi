# tree-sitter-openapi

OpenAPI grammar for [tree-sitter](https://tree-sitter.github.io/). Parses **OpenAPI (Swagger) 2.0**, **OpenAPI 3.0.x**, **3.1.x**, and **3.2.x** documents in **YAML** and **JSON**, with **Markdown** injection into `description` fields.

## Supported versions

- **Swagger 2.0** (OpenAPI 2.0) – `swagger: "2.0"`, `host`, `basePath`, `definitions`, `securityDefinitions`, etc.
- **OpenAPI 3.0.x** – `openapi: "3.0.x"`, `servers`, `components`, `paths`, etc.
- **OpenAPI 3.1.x** – same as 3.0 with `jsonSchemaDialect` and other 3.1 features
- **OpenAPI 3.2.x** – same as 3.1 with 3.2 dialect and extensions

Highlighting and structure are version-agnostic; all of the above use the same YAML/JSON grammar and OpenAPI-aware queries.

## Features

- **YAML** – Full YAML OpenAPI specs (block/flow, scalars, anchors, etc.)
- **JSON** – JSON OpenAPI specs
- **Root and fragment files** – Supports both full root documents and standalone fragment files referenced via `$ref` (e.g. a single schema, path item, parameter, or response in its own file). All common OpenAPI and JSON Schema keys are highlighted in fragments.
- **Markdown in descriptions** – `description` values are injected with tree-sitter-markdown for highlighting in editors that support language injection (Neovim, Helix, Zed)

## Grammars

This package ships two grammars:

| Grammar       | Scope              | File types | Use case           |
|---------------|--------------------|------------|--------------------|
| `openapi`     | `source.openapi`   | yaml, yml  | YAML OpenAPI docs  |
| `openapi_json`| `source.openapi.json` | json   | JSON OpenAPI docs  |

## Installation

### Node

```bash
npm install tree-sitter-openapi
```

### Neovim (nvim-treesitter)

Add to your parser config:

```lua
openapi = { install_info = { url = "https://github.com/.../tree-sitter-openapi", files = { "src/parser.c", "src/scanner.c" } } }
```

(Adjust `url` and grammar paths for the openapi and openapi_json grammars as required by nvim-treesitter’s multi-grammar support.)

## Build

- Build both grammars: `npm run build` (runs `tree-sitter generate` in each grammar directory)
- Install native addon: `npm install`
- Run tests: `npm test`
- Playground: `npm start`

## License

MIT. The YAML grammar is adapted from [tree-sitter-yaml](https://github.com/tree-sitter-grammars/tree-sitter-yaml) (MIT). The JSON grammar is adapted from [tree-sitter-json](https://github.com/tree-sitter/tree-sitter-json) (MIT).
