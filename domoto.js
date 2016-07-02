const ImportTemplate = require('domoto/importTemplate');
const ItemMenu = require('domoto/itemMenu');
const EventEmitter = require('events');

module.exports = class Domoto extends EventEmitter {
  constructor(name, templatePath, controllerClass) {
    super();

    this.controller = null;
    this.name = name;
    this.itemMenu = new ItemMenu(this.name);
    this.itemMenu.description = this._itemMenuDescription;

    if (this._itemMenuIcon)
      this.itemMenu.addLeftIcon(this._itemMenuIcon);

    if (this._canRemoveItemMenu)
      this.itemMenu.setRemoveBody();

    this.body = new ImportTemplate(templatePath);
    this.body.on('load', () => this._onLoad(controllerClass));
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

  _onLoad(controller) {
    this.controller = new controller(this.body, this.itemMenu);
    this.emit('ready', this);
  }
};
