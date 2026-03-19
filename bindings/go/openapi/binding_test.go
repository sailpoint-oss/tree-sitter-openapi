package tree_sitter_openapi_test

import (
	"testing"
	"unsafe"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_openapi "github.com/sailpoint-oss/tree-sitter-openapi/bindings/go/openapi"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(unsafe.Pointer(tree_sitter_openapi.Language()))
	if language == nil {
		t.Fatal("failed to load openapi YAML grammar")
	}
}
