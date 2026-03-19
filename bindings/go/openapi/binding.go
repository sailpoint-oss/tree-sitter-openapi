package tree_sitter_openapi

// #cgo CFLAGS: -std=c11 -fPIC
// #include "../../../tree-sitter-openapi/src/parser.c"
// #include "../../../tree-sitter-openapi/src/scanner.c"
// #include "../../../tree-sitter-openapi/src/schema.core.c"
import "C"

import "unsafe"

// Language returns the tree-sitter Language for OpenAPI YAML.
func Language() unsafe.Pointer {
	return unsafe.Pointer(C.tree_sitter_openapi())
}
