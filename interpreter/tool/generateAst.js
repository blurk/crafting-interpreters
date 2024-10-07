const fs = require("node:fs");

if (process.argv.length !== 2) {
  console.error("Usage: node generate_ast.js <output directory>");
  process.exit(1);
}

const outputDir = process.argv[2];

defineAst(outputDir, "Expr", [
  "Assign   : name, value",
  "Binary   : left, operator, right",
  "Grouping : expression",
  "Literal  : value",
  "Unary    : operator, right",
  "Variable : name",
]);

defineAst(outputDir, "Stmt", [
  "Block      : statements",
  "Expression : expression",
  "Print      : expression",
  "Var        : name, initializer",
]);

function defineType(path, baseName, className, fieldList) {
  const stringToAppend = `class ${className} extends ${baseName} {\nconstructor(${fieldList}) {\nsuper();\n${fieldList
    .split(",")
    .map((item) => `this.${item.trim()} = ${item.trim()};`)
    .join(
      "\n"
    )}\n}accept(visitor){return  visitor.visit${className}${baseName}(this);}\n}\n`;

  fs.appendFileSync(path, stringToAppend);
}

function defineAst(outputDir = "interpreter", baseName, types) {
  const path = outputDir + "/" + baseName + ".js";

  //   const visitorString = defineVisitor(baseName, types);
  // \n${visitorString}
  // \nconstructor() {}

  let data = `class ${baseName} {\naccept(visitor){}\n}\n`;

  fs.writeFileSync(path, data);

  for (const type of types) {
    const className = type.split(":")[0].trim();
    const fields = type.split(":")[1].trim();

    defineType(path, baseName, className, fields);
  }

  fs.appendFileSync(
    path,
    `module.exports={${baseName}, ${types
      .map((type) => type.split(":")[0].trim())
      .join(",")}}`
  );
}

function defineVisitor(baseName, types) {
  let result = "";
  for (const type of types) {
    const typeName = type.split(":")[0].trim();

    result += `visit${typeName}${baseName}(${baseName.toLowerCase()}){};\n`;
  }

  return result;
}
