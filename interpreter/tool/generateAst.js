const fs = require("node:fs");
const path = require("node:path");

if (process.argv.length !== 2) {
  console.error("Usage: node generate_ast.js <output directory>");
  process.exit(1);
}

const outputDir = process.argv[2];

defineAst(outputDir, "Expr", [
  "Binary   : left, operator, right",
  "Grouping : expression",
  "Literal  : value",
  "Unary    : operator, right",
]);

function defineType(path, baseName, className, fieldList) {
  const stringToAppend = `class ${className} extends ${baseName} {\nconstructor(${fieldList}) {\n${fieldList
    .split(",")
    .map((item) => `this.${item.trim()} = ${item.trim()};`)
    .join("\n")}\n}\n}\n`;

  fs.appendFileSync(path, stringToAppend);
}

function defineAst(outputDir = "interpreter", baseName, types) {
  const path = outputDir + "/" + baseName + ".js";

  let data = `class ${baseName} {\nconstructor() {}\n}\n`;

  fs.writeFileSync(path, data);

  for (const type of types) {
    const className = type.split(":")[0].trim();
    const fields = type.split(":")[1].trim();

    defineType(path, baseName, className, fields);
  }
}
