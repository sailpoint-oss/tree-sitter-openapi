use std::path::PathBuf;

fn main() {
    let root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let openapi_src = root.join("tree-sitter-openapi/src");
    let openapi_json_src = root.join("tree-sitter-openapi-json/src");

    cc::Build::new()
        .include(&openapi_src)
        .include(&openapi_json_src)
        .file(openapi_src.join("parser.c"))
        .file(openapi_src.join("scanner.c"))
        .file(openapi_src.join("schema.core.c"))
        .file(openapi_json_src.join("parser.c"))
        .compile("tree-sitter-openapi");
}
