package tree_sitter_openapi_json_test

import (
	"testing"
	"unsafe"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_openapi_json "github.com/sailpoint-oss/tree-sitter-openapi/bindings/go/openapi_json"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(unsafe.Pointer(tree_sitter_openapi_json.Language()))
	if language == nil {
		t.Fatal("failed to load openapi JSON grammar")
	}
}

func TestCanParseOpenAPIJSON(t *testing.T) {
	language := tree_sitter.NewLanguage(unsafe.Pointer(tree_sitter_openapi_json.Language()))
	if language == nil {
		t.Fatal("failed to load openapi JSON grammar")
	}
	parser := tree_sitter.NewParser()
	defer parser.Close()
	if err := parser.SetLanguage(language); err != nil {
		t.Fatalf("SetLanguage: %v", err)
	}

	tree := parser.Parse([]byte(`{
  "openapi": "3.1.0",
  "info": {
    "title": "Example",
    "version": "1.0.0"
  },
  "paths": {}
}`), nil)
	if tree == nil {
		t.Fatal("expected parse tree")
	}
	defer tree.Close()

	root := tree.RootNode()
	if root == nil {
		t.Fatal("expected root node")
	}
	if root.HasError() {
		t.Fatal("expected valid JSON parse without syntax errors")
	}
	if root.ChildCount() == 0 {
		t.Fatal("expected parsed children")
	}
}
