const EventEmitter = require('events');

module.exports = class ImportTemplate extends EventEmitter {
  constructor(path) {
    super();

    this.document = document.createElement('div');
    this._link = document.createElement('link');
    this._link.href = path;
    this._link.rel = 'import';
    this._link.setAttribute('async', '');
    this._link.onload = (e) => this._onLoad(e);
    this._link.onerror = (e) => this._onError(e);

    document.head.appendChild(this._link);
  }

  add(root) {
    root.appendChild(this.document);
  }

  remove() {
    this.document.remove();
  }

  show() {
    this.document.classList.remove('hide');
  }

  hide() {
    if (!this.document.classList.contains('hide'))
      this.document.classList.add('hide');
  }

  toggleShow() {
    this.document.classList.toggle('hide');
  }

  getElementById(id) {
    return this.document.querySelector('#' + id);
  }

  getElementsByTagName(tagName) {
    return this.document.getElementsByTagName(tagName);
  }

  querySelectorAll(selector) {
    return this.document.querySelectorAll(selector);
  }

  querySelector(selector) {
    return this.document.querySelector(selector);
  }

  _onLoad() {
    const template = this._link.import.querySelector('template');
    this.document.appendChild(document.importNode(template.content, true));
    this.emit('load', this);
  }

  _onError(e) {
    this.emit('error', new Error(`No se pudo cargar el recurso "${e.target.href}"`));
  }
};
