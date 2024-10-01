const { Literal, Grouping, Expr, Unary, Binary } = require("./Expr");
const { Print, Expression, Stmt } = require("./Stmt");
const RuntimeError = require("./RuntimeError");
const { TOKEN_TYPE } = require("./token");

class Interpreter {
  constructor(runtimeError) {
    this.runtimeError = runtimeError;
  }

  _stringify(object) {
    if (object === null) {
      return "nil";
    }

    /* This code is for Java but it doesn't happen in JS
    if (typeof object === "number") {
      let text = object.toString();
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    } */

    return object;
  }
  /**
   * @param {Print | Expression} statements
   */
  interpret(statements) {
    try {
      for (const statement of statements) {
        this._execute(statement);
      }
    } catch (/** @type {RuntimeError}*/ error) {
      this.runtimeError(error);
    }
  }

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
   * @param {Stmt} stmt
   */
  _execute(stmt) {
    stmt.accept(this);
  }

  /**
   * @param {Expression} stmt
   */
  visitExpressionStmt(stmt) {
    this._evaluate(stmt.expression);
  }

  /**
   * @param {Print} stmt
   */
  visitPrintStmt(stmt) {
    const value = this._evaluate(stmt.expression);
    console.log(JSON.stringify(value));
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
    if (typeof object === "boolean") return Boolean(object);
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
        this._checkNumberOperand(expr.operator, right);
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

  _checkNumberOperand(operator, operand) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  _checkNumberOperands(operator, left, right) {
    if (typeof left === "number" && typeof right === "number") {
      return;
    }

    throw new RuntimeError(operator, "Operands must be numbers.");
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
        this._checkNumberOperands(expr.operator, left, right);
        return +left - +right;
      case TOKEN_TYPE.SLASH:
        this._checkNumberOperands(expr.operator, left, right);
        return +left / +right;
      case TOKEN_TYPE.STAR:
        this._checkNumberOperands(expr.operator, left, right);
        return +left * +right;
      case TOKEN_TYPE.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }

        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }

        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings."
        );

        break;

      case TOKEN_TYPE.GREATER:
        this._checkNumberOperands(expr.operator, left, right);
        return +left > +right;
      case TOKEN_TYPE.GREATER_EQUAL:
        this._checkNumberOperands(expr.operator, left, right);
        return +left >= +right;
      case TOKEN_TYPE.LESS:
        this._checkNumberOperands(expr.operator, left, right);
        return +left < +right;
      case TOKEN_TYPE.LESS_EQUAL:
        this._checkNumberOperands(expr.operator, left, right);
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

module.exports = Interpreter;
