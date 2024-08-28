const { TOKEN_TYPE, Token } = require("./token");
const Expr = require("./Expr");

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

  /**
   * @param {Token[]} tokens
   * @param {errorToken} error
   */
  constructor(tokens, error) {
    this.#tokens = tokens;

    this.error = error;
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
    if (!this._isAtEnd()) current++;
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
    Lox.error(token, message);
    return new ParseError();
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

    while (match(TOKEN_TYPE.MINUS, TOKEN_TYPE.PLUS)) {
      const operator = previous();
      const right = factor();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  factor() {
    let expr = this.unary();

    while (match(TOKEN_TYPE.SLASH, TOKEN_TYPE.STAR)) {
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
      this.consume(TOKEN_TYPE.RIGHT_PAREN, "Expect ')' after expression.");
      return new Expr.Grouping(expr);
    }
  }
}

module.exports = Parser;
