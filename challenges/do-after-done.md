1. Add support to Lox’s scanner for C-style /_ ... _/ block comments. Make sure to handle newlines in them. Consider allowing them to nest. Is adding support for nesting more work than you expected? Why?

- https://github.com/wren-lang/wren/blob/c6eb0be99014d34085e2d24c696aed449e2fb171/src/vm/wren_compiler.c#L663