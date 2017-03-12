const ImportTemplate = require('domoto/importTemplate');
const ViewManager = require('./viewManager');
const ItemMenu = require('domoto/itemMenu');
const EventEmitter = require('events');
const Confirm = require('./confirm');

module.exports = class Domoto extends EventEmitter {
  constructor(name, templatePath, controller) {
    super();

    this.name = name;
    this.viws = [];
    this.items = [];
    this.controllers = [];
    this.confirm = Confirm.instance;
    this.itemMenu = new ItemMenu(this._itemMenuDescription);
    this.body = this.addView(templatePath, controller, this.itemMenu);
    this.viewManager = ViewManager.instance;

    this.itemMenu.on('click', this.viewManager.add(this, this.body));

    if (this._itemMenuIcon)
      this.itemMenu.iconLeft = this._itemMenuIcon;

    if (this._canRemoveItemMenu) {
      this.itemMenu.setRemove();
      this.itemMenu.on('remove', () => this._onRemove(name));
    }
  }

  get _itemMenuDescription() {
    return this.name;
  }

  get _itemMenuIcon() {
    return 'power_settings_new';
  }

  get _canRemoveItemMenu() {
    return true;
  }

  addView(path, controller, ...params) {
    const view = new ImportTemplate(path);
    view.on('load', () => this._onLoad(view, controller, ...params));
    this.viws.push(view);
    return view;
  }

  remove() {
    this.body.remove();
    this.itemMenu.remove();
    this.viewManager.remove(this);
  }

  _onRemove(name) {
    this.confirm(`¿Estas seguro de querer eliminar la extensión "${name}"?`, 'Extensiones')
      .on('confirm', () => this.emit('remove', this));
  }

  _onLoad(view, controller, ...params) {
    view.hide();
    if (controller)
      this.controllers.push(new controller(view, ...params));

    this.emit('load', view);
  }
};
