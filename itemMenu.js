const ElementMenu = require('./elementMenu');

module.exports = class ItemMenu extends ElementMenu {
  constructor(description) {
    super(description);

    this._childElements = null;
  }

  addChild(childItemMenu) {
    this.childElements.appendChild(childItemMenu.element);
    return childItemMenu;
  }

  get childElements() {
    if (!this._childElements) {
      this._childElements = document.createElement('ul');
      const div = document.createElement('div');
      div.classList.add('collapsible-body');
      div.appendChild(this._childElements);
      this._elementBody.parentElement.appendChild(div);
    }

    return this._childElements;
  }

  _createBodyElement() {
    return '<div class="collapsible-header waves-effect waves-light truncate"> </div>';
  }
};
