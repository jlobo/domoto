const EventEmitter = require('events');

module.exports = class ImportTemplate extends EventEmitter {
  constructor(path) {
    super();

    this.document = null;
    this.container = document.createElement('div');
    this._link = document.createElement('link');
    this._link.href = path;
    this._link.rel = 'import';
    this._link.setAttribute('async', '');
    this._link.onload = (e) => this._onLoad(e);
    this._link.onerror = (e) => this._onError(e);

    document.head.appendChild(this._link);
  }

  _onLoad() {
    const template = this._link.import.querySelector('template');
    this.document = document.importNode(template.content, true);
    this.emit('load', this.document);
  }

  _onError(e) {
    this.emit('error', new Error(`No se pudo cargar el recurso "${e.target.href}"`));
  }

  add(root) {
    this.container.appendChild(this.document);
    root.appendChild(this.container);
  }

  remove() {
    this.container.remove();
  }

  show() {
    this.container.classList.remove('hide');
  }

  hide() {
    if (!this.container.classList.contains('hide'))
      this.container.classList.add('hide');
  }

  toggleShow() {
    this.container.classList.toggle('hide');
  }

  getElementById(id) {
    return this.document.getElementById(id);
  }

  getElementsByTagName(tagName) {
    return this.document.getElementsByTagName(tagName);
  }

  getElementByClassName(className) {
    return this.document.getElementByClassName(className);
  }

  querySelectorAll(selector) {
    return this.document.querySelectorAll(selector);
  }

  querySelector(selector) {
    return this.document.querySelector(selector);
  }
};
