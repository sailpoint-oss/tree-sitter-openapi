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

func TestCanParseOpenAPIYAML(t *testing.T) {
	language := tree_sitter.NewLanguage(unsafe.Pointer(tree_sitter_openapi.Language()))
	if language == nil {
		t.Fatal("failed to load openapi YAML grammar")
	}
	parser := tree_sitter.NewParser()
	defer parser.Close()
	if err := parser.SetLanguage(language); err != nil {
		t.Fatalf("SetLanguage: %v", err)
	}

	tree := parser.Parse([]byte(`openapi: "3.1.0"
info:
  title: Example
  version: "1.0.0"
paths: {}
`), nil)
	if tree == nil {
		t.Fatal("expected parse tree")
	}
	defer tree.Close()

	root := tree.RootNode()
	if root == nil {
		t.Fatal("expected root node")
	}
	if root.HasError() {
		t.Fatal("expected valid YAML parse without syntax errors")
	}
	if root.ChildCount() == 0 {
		t.Fatal("expected parsed children")
	}
}
