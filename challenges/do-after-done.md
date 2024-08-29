~~1. Add support to Lox’s scanner for C-style /_ ... _/ block comments. Make sure to handle newlines in them. Consider allowing them to nest. Is adding support for nesting more work than you expected? Why?~~

2. Add support for comma expressions. Give them the same precedence and associativity as in C. Write the grammar, and then implement the necessary parsing code.

3. Likewise, add support for the C-style conditional or “ternary” operator `?:`. What precedence level is allowed between the ? and :? Is the whole operator left-associative or right-associative?

4. Add error productions to handle each binary operator appearing without a left-hand operand. In other words, detect a binary operator appearing at the beginning of an expression. Report that as an error, but also parse and discard a right-hand operand with the appropriate precedence.
