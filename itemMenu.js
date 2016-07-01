const EventEmitter = require('events');
const Confirm = require('./confirm');

module.exports = class ItemMenu extends EventEmitter {
  constructor(code) {
    super();

    this._bodyElement = null;
    this._confirm = Confirm.instance;

    this.code = code;
    this.element = document.createElement('li');
    this.element.classList.add('bold');
    this.element.innerHTML = '<div class="collapsible-header waves-effect waves-light truncate"> </div>';
    this._header = this.element.firstElementChild;
    this._description = this._header.firstChild;
    this._header.addEventListener('click', e => this.emit('click', e));
  }

  get description() {
    return this._description.textContent;
  }

  set description(value) {
    this._description.textContent = value;
  }

  set leftIconOn(value) {
    this._setIconOn(this._iconLeft, value);
  }

  set rightIconOn(value) {
    this._setIconOn(this._iconLeft, value);
  }

  addLeftIcon(icon) {
    this._addIcon(icon, false);
  }

  addRightIcon(icon) {
    this._addIcon(icon, true);
  }

  add(root, first = false) {
    first ? root.insertBefore(this.element, root.children[1])
      : root.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  setRemoveBody() {
    const li = document.createElement('li');
    li.innerHTML = '<a href="#"><i class="material-icons secondary-content">delete</i>Remover</a>';
    li.firstElementChild.addEventListener('click', e => this._onClickRemove(e));

    this._body.appendChild(li);

    return this;
  }

  get _body() {
    if (this._bodyElement)
      return this._bodyElement;

    this._bodyElement = document.createElement('ul');
    const div = document.createElement('div');
    div.classList.add('collapsible-body');
    div.appendChild(this._bodyElement);
    this._header.parentElement.appendChild(div);

    return this._bodyElement;
  }

  _setIconOn(iconElement, on) {
    iconElement.classList.remove('light-green-text');
    iconElement.classList.remove('text-accent-3');

    if (on) {
      iconElement.classList.add('light-green-text');
      iconElement.classList.add('text-accent-3');
    }
  }

  _addIcon(icon, right = false) {
    const iconElement = document.createElement('i');
    iconElement.classList.add('material-icons');
    iconElement.innerText = icon;
    this._header.appendChild(iconElement);

    if (!right)
      return (this._iconLeft = iconElement);

    this._iconRight = iconElement;
    iconElement.classList.add('secondary-content');
  }

  _onClickRemove(e) {
    this._confirm('¿Estas seguro de querer eliminar la extensión?', 'Extensiones')
      .on('confirm', () => this.emit('remove', e, this.code));
  }
};
