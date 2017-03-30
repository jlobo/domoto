const EventEmitter = require('events');

module.exports = class ElementMenu extends EventEmitter {
  constructor(description) {
    super();

    this.element = document.createElement('li');
    this.element.classList.add('bold');
    this.element.innerHTML = this._createBodyElement();
    this._elementBody = this.element.firstElementChild;
    this._description = this._elementBody.firstChild;
    this.description = description;
    this._elementBody.addEventListener('click', () => this.emit('click', this));
  }

  get description() {
    return this._description.textContent;
  }

  set description(value) {
    this._description.textContent = value;
  }

  set iconOn(value) {
    if (!this._iconLeft)
      return;

    const list = this._iconLeft.classList;
    if (value)
      list.add('light-green-text', 'text-accent-3');
    else
      list.remove('light-green-text', 'text-accent-3');
  }

  set iconLeft(icon) {
    if (!this._iconLeft)
      this._iconLeft = this._createIcon();

    this._iconLeft.innerText = icon;
  }

  set iconRight(icon) {
    if (!this._iconRight) {
      this._iconRight = this._createIcon();
      this._iconRight.classList.add('secondary-content');
    }

    this._iconRight.innerText = icon;
  }

  setRemove() {
    this.iconRight = 'delete';
    this._iconRight.addEventListener('click', e => {
      e.stopPropagation();
      this.emit('remove', this);
    });
  }

  remove() {
    this.element.remove();
  }

  _createBodyElement() {
    throw new Error('You have to implement this method');
  }

  _createIcon() {
    const iconElement = document.createElement('i');
    iconElement.classList.add('material-icons');
    this._elementBody.appendChild(iconElement);

    return iconElement;
  }
};
