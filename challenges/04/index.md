# Challenges

1. The lexical grammars of Python and Haskell are not regular. What does that mean, and why aren’t they?

Lexical grammar is a set of rules that define how a sequence of characters should be broken down into tokens => regular grammar is a type of formal grammar that can be recognized by the scanner => It can determine if a given input string is a valid token based on its current state and the next characters it reads.
=> If a lexical grammar is not regular, it means that it cannot be recognized by scanner => The language requires a more complex type of automaton.

The primary reason why the lexical grammars of Python and Haskell are not regular is due to nested constructs: Nested comment, String literals

2. Aside from separating tokens—distinguishing print foo from printfoo—spaces aren’t used for much in most languages. However, in a couple of dark corners, a space does affect how code is parsed in CoffeeScript, Ruby, and the C preprocessor. Where and what effect does it have in each of those languages?

- Macro Definition in C
- Symbol Literal in Ruby
- Method Invocation in CoffeeScript

3. Our scanner here, like most, discards comments and whitespace since those aren’t needed by the parser. Why might you want to write a scanner that does not discard those? What would it be useful for?

- Syntax Highlighting
- Code Analysis and Refactoring
- Debugging and Tracing
- Educational Tools
- Code Generation
