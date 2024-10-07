const { Token } = require("./token");

const RuntimeError = require("./RuntimeError");

class Environment {
  #values = new Map();
  /** @type {Environment} */
  enclosing = null;

  constructor(enclosing) {
    this.enclosing = enclosing;
  }

  /**
   * @param {Token} name
   */
  get(name) {
    if (this.#values.has(name.lexeme)) {
      return this.#values.get(name.lexeme);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }
  /**
   *
   * @param {Token} name
   * @param {object} value
   */
  assign(name, value) {
    if (this.#values.has(name.lexeme)) {
      this.#values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing !== null) {
      return this.enclosing.assign(name);
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  define(name, value) {
    this.#values.set(name, value);
  }
}

module.exports = Environment;
