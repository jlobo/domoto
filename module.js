const singleton = Symbol();
const singletonEnforcer = Symbol();

module.exports = class Module {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer)
      throw new Error('Cannot construct singleton');

    this.modules = new Map();
  }

  static get instance() {
    if (!this[singleton])
      this[singleton] = new Module(singletonEnforcer);

    return this[singleton];
  }

  export(name, module) {
    this.modules.set(name, module);
  }

  get(name) {
    return this.modules.get(name);
  }
};
