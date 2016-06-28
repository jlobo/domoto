const EventEmitter = require('events');
const singleton = Symbol();
const singletonEnforcer = Symbol();

module.exports = class ConfirmNative {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer)
      throw new Error('Cannot construct singleton');

    this._emitter = null;
    this.show = this.show.bind(this);
  }

  show(message) {
    setTimeout(() => this.interval(message), 100);
    return (this._emitter = new EventEmitter());
  }

  interval(message) {
    var isOk = confirm(message); 
    this._emitter.emit(isOk ? 'confirm' : 'cancel', this)
  }

  static get instance() {
    if (!this[singleton])
      this[singleton] = new ConfirmNative(singletonEnforcer);

    return this[singleton].show;
  }
};
