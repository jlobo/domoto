const ImportTemplate = require('domoto/importTemplate');
const ItemMenu = require('domoto/itemMenu');
const EventEmitter = require('events');
const Confirm = require('./confirm');

module.exports = class Domoto extends EventEmitter {
  constructor(name, templatePath, controllerClass) {
    super();

    this.controller = null;
    this.name = name;
    this._confirm = Confirm.instance;
    this.body = new ImportTemplate(templatePath);
    this.body.on('load', () => this._onLoad(controllerClass));
    this.itemMenu = new ItemMenu(this._itemMenuDescription);

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

  _onRemove(name) {
    this._confirm(`¿Estas seguro de querer eliminar la extensión "${name}"?`, 'Extensiones')
      .on('confirm', () => this.emit('remove', this));
  }

  _onLoad(controller) {
    this.controller = new controller(this.body, this.itemMenu);
    this.emit('ready', this);
  }
};
