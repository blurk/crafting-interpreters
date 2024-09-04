const { Literal, Grouping, Expr, Unary, Binary } = require("./Expr");
const { TOKEN_TYPE } = require("./token");

class Interpreter {
  constructor() {}

  /**
   * Evaluating literals
   * @param {Literal} expr
   * @returns {Literal['value']}
   */
  visitLiteralExpr(expr) {
    return expr.value;
  }

  /**
   * @param {Expr} expr
   */
  _evaluate(expr) {
    return expr.accept(this);
  }

  /**
   * Evaluating parentheses
   * @param {Grouping} expr
   * @returns {Grouping['expression']}
   */
  visitGroupingExpr(expr) {
    return this._evaluate(expr.expression);
  }

  /**
   * @param {Object} expr
   * @returns {boolean}
   */
  _isTruthy(object) {
    if (object === null) {
      return false;
    }
    if (object instanceof Boolean) return Boolean(object);
    return true;
  }

  /**
   * Evaluating unary expressions
   * @param {Unary} expr
   */
  visitUnaryExpr(expr) {
    const right = this._evaluate(expr.right);

    switch (expr.operator.type) {
      case TOKEN_TYPE.BANG:
        return !this._isTruthy(right);
      case TOKEN_TYPE.MINUS:
        return -right;
    }

    // Unreachable.
    return null;
  }

  _isEqual(a, b) {
    if (a === null && b === null) return true;
    if (a === null) return false;

    return a === b;
  }

  /**
   * Evaluating binary operators
   * @param {Binary} expr
   */

  visitBinaryExpr(expr) {
    const left = this._evaluate(expr.left);
    const right = this._evaluate(expr.right);

    switch (expr.operator.type) {
      case TOKEN_TYPE.MINUS:
        return +left - +right;
      case TOKEN_TYPE.SLASH:
        return +left / +right;
      case TOKEN_TYPE.STAR:
        return +left * +right;
      case TOKEN_TYPE.PLUS:
        if (left instanceof Number && right instanceof Number) {
          return left + right;
        }

        if (left instanceof String && right instanceof String) {
          return left + right;
        }

        break;

      case TOKEN_TYPE.GREATER:
        return +left > +right;
      case TOKEN_TYPE.GREATER_EQUAL:
        return +left >= +right;
      case TOKEN_TYPE.LESS:
        return +left < +right;
      case TOKEN_TYPE.LESS_EQUAL:
        return +left <= +right;

      case TOKEN_TYPE.BANG_EQUAL:
        return !this._isEqual(left, right);
      case TOKEN_TYPE.EQUAL_EQUAL:
        return this._isEqual(left, right);
    }

    // Unreachable.
    return null;
  }
}
