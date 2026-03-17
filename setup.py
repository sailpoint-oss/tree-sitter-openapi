from os import path
from sysconfig import get_config_var

from setuptools import Extension, find_packages, setup
from setuptools.command.build import build
from setuptools.command.build_ext import build_ext
from setuptools.command.egg_info import egg_info
from wheel.bdist_wheel import bdist_wheel

OPENAPI_SRC = "tree-sitter-openapi/src"
OPENAPI_JSON_SRC = "tree-sitter-openapi-json/src"
BINDING = "bindings/python/tree_sitter_openapi/binding.c"


class Build(build):
    def run(self):
        for grammar, query_dir in [
            ("tree-sitter-openapi", "tree-sitter-openapi/queries"),
            ("tree-sitter-openapi-json", "tree-sitter-openapi-json/queries"),
        ]:
            if path.isdir(query_dir):
                dest = path.join(self.build_lib, "tree_sitter_openapi", "queries", grammar)
                self.copy_tree(query_dir, dest)
        super().run()


class BuildExt(build_ext):
    def build_extension(self, ext: Extension):
        if self.compiler.compiler_type != "msvc":
            ext.extra_compile_args = ["-std=c11", "-fvisibility=hidden"]
        else:
            ext.extra_compile_args = ["/std:c11", "/utf-8"]
        if ext.py_limited_api:
            ext.define_macros.append(("Py_LIMITED_API", "0x030A0000"))
        super().build_extension(ext)


class BdistWheel(bdist_wheel):
    def get_tag(self):
        python, abi, platform = super().get_tag()
        if python.startswith("cp"):
            python, abi = "cp310", "abi3"
        return python, abi, platform


class EggInfo(egg_info):
    def find_sources(self):
        super().find_sources()
        for query_dir in ["tree-sitter-openapi/queries", "tree-sitter-openapi-json/queries"]:
            if path.isdir(query_dir):
                self.filelist.recursive_include(query_dir, "*.scm")
        self.filelist.include(f"{OPENAPI_SRC}/tree_sitter/*.h")
        self.filelist.include(f"{OPENAPI_JSON_SRC}/tree_sitter/*.h")


setup(
    packages=find_packages("bindings/python"),
    package_dir={"": "bindings/python"},
    package_data={
        "tree_sitter_openapi": ["py.typed"],
    },
    ext_package="tree_sitter_openapi",
    ext_modules=[
        Extension(
            name="_binding",
            sources=[
                BINDING,
                f"{OPENAPI_SRC}/parser.c",
                f"{OPENAPI_SRC}/scanner.c",
                f"{OPENAPI_SRC}/schema.core.c",
                f"{OPENAPI_JSON_SRC}/parser.c",
            ],
            define_macros=[
                ("PY_SSIZE_T_CLEAN", None),
                ("TREE_SITTER_HIDE_SYMBOLS", None),
            ],
            include_dirs=[OPENAPI_SRC, OPENAPI_JSON_SRC],
            py_limited_api=not get_config_var("Py_GIL_DISABLED"),
        )
    ],
    cmdclass={
        "build": Build,
        "build_ext": BuildExt,
        "bdist_wheel": BdistWheel,
        "egg_info": EggInfo,
    },
    zip_safe=False,
)
