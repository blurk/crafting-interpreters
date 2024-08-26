class Expr {
  constructor() {}
}
class Binary extends Expr {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}
class Grouping extends Expr {
  constructor(expression) {
    this.expression = expression;
  }
}
class Literal extends Expr {
  constructor(value) {
    this.value = value;
  }
}
class Unary extends Expr {
  constructor(operator, right) {
    this.operator = operator;
    this.right = right;
  }
}
