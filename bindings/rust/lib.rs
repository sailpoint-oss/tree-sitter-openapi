//! Rust bindings for tree-sitter-openapi (YAML) and tree-sitter-openapi-json.

use tree_sitter::Language;

extern "C" {
    fn tree_sitter_openapi() -> *mut Language;
    fn tree_sitter_openapi_json() -> *mut Language;
}

/// OpenAPI YAML grammar.
pub fn openapi() -> Language {
    unsafe { Language::from_raw(tree_sitter_openapi() as *const _) }
}

/// OpenAPI JSON grammar.
pub fn openapi_json() -> Language {
    unsafe { Language::from_raw(tree_sitter_openapi_json() as *const _) }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_can_load_grammars() {
        let _ = openapi();
        let _ = openapi_json();
    }
}
