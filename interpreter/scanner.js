const { Token, TOKEN_TYPE } = require("./token");

const keywords = new Map([
  ["and", TOKEN_TYPE.AND],
  ["class", TOKEN_TYPE.CLASS],
  ["else", TOKEN_TYPE.ELSE],
  ["false", TOKEN_TYPE.FALSE],
  ["for", TOKEN_TYPE.FOR],
  ["fun", TOKEN_TYPE.FUN],
  ["if", TOKEN_TYPE.IF],
  ["nil", TOKEN_TYPE.NIL],
  ["or", TOKEN_TYPE.OR],
  ["print", TOKEN_TYPE.PRINT],
  ["return", TOKEN_TYPE.RETURN],
  ["super", TOKEN_TYPE.SUPER],
  ["this", TOKEN_TYPE.THIS],
  ["true", TOKEN_TYPE.TRUE],
  ["var", TOKEN_TYPE.VAR],
  ["while", TOKEN_TYPE.WHILE],
]);

class Scanner {
  #source = "";
  #tokens = [];
  #start = 0;
  #current = 0;
  #line = 1;

  constructor(source = "", error) {
    this.#source = source;
    this.error = error;
  }

  isAtEnd() {
    return this.#current >= this.#source.length;
  }

  advance() {
    return this.#source.charAt(this.#current++);
  }

  addToken(type, literal = null) {
    const text = this.#source.substring(this.#start, this.#current);
    this.#tokens.push(new Token(type, text, literal, this.#line));
  }

  match(expected = "") {
    if (this.isAtEnd()) return false;
    if (this.#source.charAt(this.#current) != expected) return false;

    this.#current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) {
      return "\0";
    }

    return this.#source.charAt(this.#current);
  }

  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.#line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      this.error(this.#line, "Unterminated string.");
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.#source.substring(this.#start + 1, this.#current - 1);
    this.addToken(TOKEN_TYPE.STRING, value);
  }

  isDigit(c = "") {
    return c >= "0" && c <= "9";
  }

  peekNext() {
    if (this.#current + 1 >= this.#source.length) return "\0";
    return this.#source.charAt(this.#current + 1);
  }

  number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for a fractional part.
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    this.addToken(
      TOKEN_TYPE.NUMBER,
      Number(this.#source.substring(this.#start, this.#current))
    );
  }

  isAlpha(c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.#source.substring(this.#start, this.#current);
    let type = keywords.get(text);
    if (!type) {
      type = TOKEN_TYPE.IDENTIFIER;
    }

    this.addToken(type);
  }

  scanToken() {
    const c = this.advance();

    switch (c) {
      case "(":
        this.addToken(TOKEN_TYPE.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TOKEN_TYPE.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TOKEN_TYPE.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TOKEN_TYPE.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TOKEN_TYPE.COMMA);
        break;
      case ".":
        this.addToken(TOKEN_TYPE.DOT);
        break;
      case "-":
        this.addToken(TOKEN_TYPE.MINUS);
        break;
      case "+":
        this.addToken(TOKEN_TYPE.PLUS);
        break;
      case ";":
        this.addToken(TOKEN_TYPE.SEMICOLON);
        break;
      case "*":
        this.addToken(TOKEN_TYPE.STAR);
        break;
      case "!":
        this.addToken(
          this.match("=") ? TOKEN_TYPE.BANG_EQUAL : TOKEN_TYPE.BANG
        );
        break;
      case "=":
        this.addToken(
          this.match("=") ? TOKEN_TYPE.EQUAL_EQUAL : TOKEN_TYPE.EQUAL
        );
        break;
      case "<":
        this.addToken(
          this.match("=") ? TOKEN_TYPE.LESS_EQUAL : TOKEN_TYPE.LESS
        );
        break;
      case ">":
        this.addToken(
          this.match("=") ? TOKEN_TYPE.GREATER_EQUAL : TOKEN_TYPE.GREATER
        );
        break;
      case "/":
        if (this.match("/")) {
          // A comment goes until the end of the line.
          while (this.peek() != "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          this.addToken(TOKEN_TYPE.SLASH);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;

      case "\n":
        this.#line++;
        break;
      case '"':
        this.string();
        break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          this.error(this.#line, "Unexpected character.");
        }
        break;
    }
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      // We are at the beginning of the next lexeme.
      this.#start = this.#current;
      this.scanToken();
    }

    this.#tokens.push(new Token(TOKEN_TYPE.EOF, "", null, this.#line));
    return this.#tokens;
  }
}

module.exports = {
  Scanner,
};
