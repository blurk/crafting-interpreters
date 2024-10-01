const { TOKEN_TYPE, Token } = require("./token");
const Expr = require("./Expr");
const Stmt = require("./Stmt");

/**
 * @callback errorToken
 * @param  {Token} token
 * @param  {string} message
 */

class ParseError extends Error {
  constructor() {
    super();
  }
}

class Parser {
  /** @type {Token[]} */
  #tokens = [];
  #current = 0;
  #error;

  /**
   * @param {Token[]} tokens
   * @param {errorToken} error
   */
  constructor(tokens, error) {
    this.#tokens = tokens;
    this.#error = error;
  }

  _printStatement() {
    const value = this.expression();
    this._consume(TOKEN_TYPE.SEMICOLON, "Expect ';' after value.");
    return new Stmt.Print(value);
  }

  _expressionStatement() {
    const expr = this.expression();
    this._consume(TOKEN_TYPE.SEMICOLON, "Expect ';' after expression.");
    return new Stmt.Expression(expr);
  }

  _statement() {
    if (this._match(TOKEN_TYPE.PRINT)) {
      return this._printStatement();
    }

    return this._expressionStatement();
  }

  parse() {
    const statements = [];

    while (!this._isAtEnd()) {
      statements.push(this._statement());
    }

    return statements;
  }

  _previous() {
    return this.#tokens[this.#current - 1];
  }

  _peek() {
    return this.#tokens[this.#current];
  }

  _isAtEnd() {
    return this._peek().type == TOKEN_TYPE.EOF;
  }

  _check(type) {
    if (this._isAtEnd()) {
      return false;
    }
    return this._peek().type === type;
  }

  _advance() {
    if (!this._isAtEnd()) this.#current++;
    return this._previous();
  }

  _match(...types) {
    for (const type of types) {
      if (this._check(type)) {
        this._advance();
        return true;
      }
    }

    return false;
  }

  _error(token, message) {
    this.#error(token, message);
    return new ParseError();
  }

  _synchronize() {
    this._advance();

    while (!this._isAtEnd()) {
      if (this._previous().type == TOKEN_TYPE.SEMICOLON) return;

      switch (this._peek().type) {
        case TOKEN_TYPE.CLASS:
        case TOKEN_TYPE.FUN:
        case TOKEN_TYPE.VAR:
        case TOKEN_TYPE.FOR:
        case TOKEN_TYPE.IF:
        case TOKEN_TYPE.WHILE:
        case TOKEN_TYPE.PRINT:
        case TOKEN_TYPE.RETURN:
          return;
      }

      this._advance();
    }
  }

  _consume(type, message) {
    if (this._check(type)) {
      return this._advance();
    }

    throw this._error(this._peek(), message);
  }

  expression() {
    return this.equality();
  }

  equality() {
    let expr = this.comparision();

    while (this._match(TOKEN_TYPE.BANG_EQUAL, TOKEN_TYPE.EQUAL_EQUAL)) {
      const operator = this._previous();
      const right = this.comparision();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  comparision() {
    let expr = this.term();

    while (
      this._match(
        TOKEN_TYPE.GREATER,
        TOKEN_TYPE.GREATER_EQUAL,
        TOKEN_TYPE.LESS,
        TOKEN_TYPE.LESS_EQUAL
      )
    ) {
      const operator = this._previous();
      const right = this.factor();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  term() {
    let expr = this.factor();

    while (this._match(TOKEN_TYPE.MINUS, TOKEN_TYPE.PLUS)) {
      const operator = this._previous();
      const right = this.factor();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  factor() {
    let expr = this.unary();

    while (this._match(TOKEN_TYPE.SLASH, TOKEN_TYPE.STAR)) {
      const operator = this._previous();
      const right = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  unary() {
    if (this._match(TOKEN_TYPE.BANG, TOKEN_TYPE.MINUS)) {
      const operator = this._previous();
      const right = this.unary();
      return new Expr.Unary(operator, right);
    }

    return this.primary();
  }

  primary() {
    if (this._match(TOKEN_TYPE.FALSE)) return new Expr.Literal(false);
    if (this._match(TOKEN_TYPE.TRUE)) return new Expr.Literal(true);
    if (this._match(TOKEN_TYPE.NIL)) return new Expr.Literal(null);

    if (this._match(TOKEN_TYPE.NUMBER, TOKEN_TYPE.STRING)) {
      return new Expr.Literal(this._previous().literal);
    }

    if (this._match(TOKEN_TYPE.LEFT_PAREN)) {
      const expr = this.expression();
      this._consume(TOKEN_TYPE.RIGHT_PAREN, "Expect ')' after expression.");
      return new Expr.Grouping(expr);
    }

    throw this._error(this._peek(), "Expect expression.");
  }
}

module.exports = Parser;
