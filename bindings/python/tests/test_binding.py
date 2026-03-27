import unittest

from tree_sitter import Parser

import tree_sitter_openapi


class BindingTest(unittest.TestCase):
    def test_openapi_yaml_language_parses_document(self) -> None:
        parser = Parser()
        parser.language = tree_sitter_openapi.openapi()
        tree = parser.parse(
            b'openapi: "3.1.0"\ninfo:\n  title: Example\n  version: "1.0.0"\npaths: {}\n'
        )

        self.assertIsNotNone(tree.root_node)
        self.assertFalse(tree.root_node.has_error)
        self.assertGreater(tree.root_node.child_count, 0)

    def test_openapi_json_language_parses_document(self) -> None:
        parser = Parser()
        parser.language = tree_sitter_openapi.openapi_json()
        tree = parser.parse(
            b'{"openapi":"3.1.0","info":{"title":"Example","version":"1.0.0"},"paths":{}}'
        )

        self.assertIsNotNone(tree.root_node)
        self.assertFalse(tree.root_node.has_error)
        self.assertGreater(tree.root_node.child_count, 0)


if __name__ == "__main__":
    unittest.main()
