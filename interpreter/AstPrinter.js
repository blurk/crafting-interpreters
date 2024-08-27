/* prints out AST in a lisp style */

class AstPrinter {
  parenthesize(name, ...exprs) {
    const builder = [];

    for (const expr of exprs) {
      builder.push(expr.accept(this));
      builder.push(" ");
    }

    builder.push(name);

    return builder.join("");
  }

  print(expr) {
    return expr.accept(this);
  }

  visitBinaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr) {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr) {
    if (expr.value == null) {
      return "nil";
    }
    return expr.value.toString();
  }

  visitUnaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }
}

module.exports = AstPrinter;
