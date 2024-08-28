const fs = require("node:fs");
const readline = require("node:readline");
const process = require("node:process");

const { Scanner } = require("./scanner");
const AstPrinter = require("./AstPrinter");
const Expr = require("./Expr");
const { Token, TOKEN_TYPE } = require("./token");

let hadError = false;

function run(source = "") {
  const scanner = new Scanner(source, error);
  const tokens = scanner.scanTokens();

  for (const token of tokens) {
    console.log(token);
  }
}

function error(line = -1, message = "") {
  report(line, "", message);
}

function errorToken(token, message) {
  if (token.type == TOKEN_TYPE.EOF) {
    report(token.line, " at end", message);
  } else {
    report(token.line, " at '" + token.lexeme + "'", message);
  }
}

function report(line = -1, where = "", message = "") {
  console.error("[line " + line + "] Error" + where + ": " + message);

  hadError = true;
}

function runFile(path) {
  if (hadError) {
    process.exit(1);
  }

  try {
    const data = fs.readFileSync(path, "utf8");
    console.log(`Running script from file: ${path}`);
    run(data);
  } catch (err) {
    console.error(err.message);
  }
}

function runPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    // Replace with your actual Lox interpreter logic here
    console.log(`> ${line}`);
    run(line);
    hadError = false;
  });
}

function main() {
  const astPrinter = new AstPrinter();
  const expression = new Expr.Binary(
    new Expr.Unary(
      new Token(TOKEN_TYPE.MINUS, "-", null, 1),
      new Expr.Literal(123)
    ),
    new Token(TOKEN_TYPE.STAR, "*", null, 1),
    new Expr.Grouping(new Expr.Literal(45.67))
  );

  console.log(astPrinter.print(expression));

  if (process.argv.length > 3) {
    console.error("Usage: jlox [script]");
    process.exit(1);
  } else if (process.argv.length === 3) {
    runFile(process.argv[2]);
  } else {
    runPrompt();
  }
}

main();

module.exports = {
  error,
};
