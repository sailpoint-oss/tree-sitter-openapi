from tree_sitter import Language

from . import _binding

__all__ = ["openapi", "openapi_json"]


def openapi() -> Language:
    return Language(_binding.language())


def openapi_json() -> Language:
    return Language(_binding.language_json())
