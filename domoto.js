const ImportTemplate = require('domoto/importTemplate');
const ViewManager = require('./viewManager');
const ItemMenu = require('domoto/itemMenu');
const EventEmitter = require('events');
const Confirm = require('./confirm');
const Module = require('./module');

module.exports = class Domoto extends EventEmitter {
  constructor(name) {
    super();

    this.name = name;
    this.views = new Set();
    this.controllers = new Set();
    this.confirm = Confirm.instance;
    this.module = Module.instance;
    this.viewManager = ViewManager.instance;
    this.itemMenu = new ItemMenu(name);
    this.itemMenu.iconLeft = 'power_settings_new';

    if (this.isRemovable) {
      this.itemMenu.setRemove();
      this.itemMenu.on('remove', () => this._onRemove(name));
    }
  }

  get isRemovable() {
    return true;
  }

  get description() {
    return this.itemMenu.description;
  }

  set description(value) {
    this.itemMenu.description = value;
  }

  addView(path, controller, ...params) {
    const view = new ImportTemplate(path);
    view.hide();
    this.views.add(view);
    view.on('load', Domoto.prototype._onLoadView.bind(this, view, controller, params));
    return view;
  }

  remove() {
    this.itemMenu.remove();
    this.viewManager.hide(...this.views);
    this.views.forEach(view => view.remove());
  }

  exportModule(module) {
    this.module.export(this.name, module);
  }

  getModule(name) {
    return this.module.get(name);
  }

  _onRemove(name) {
    this.confirm(`¿Estas seguro de querer eliminar la extensión "${name}"?`, 'Extensiones')
      .on('confirm', () => this.emit('remove', this));
  }

  _onLoadView(view, controller, params) {
    if (controller)
      this.controllers.add(new controller(view, ...params));

    this.emit('loadView', view);
  }
};
