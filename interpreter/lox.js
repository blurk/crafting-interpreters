const fs = require("node:fs");
const readline = require("node:readline");
const process = require("node:process");

const { Scanner } = require("./scanner");

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
