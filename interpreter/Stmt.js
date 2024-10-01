class Stmt {
accept(visitor){}
}
class Expression extends Stmt {
constructor(expression) {
super();
this.expression = expression;
}accept(visitor){return  visitor.visitExpressionStmt(this);}
}
class Print extends Stmt {
constructor(expression) {
super();
this.expression = expression;
}accept(visitor){return  visitor.visitPrintStmt(this);}
}
module.exports={Stmt, Expression,Print}