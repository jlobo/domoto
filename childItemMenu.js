const ElementMenu = require('./elementMenu');

module.exports = class ChildItemMenu extends ElementMenu {
  constructor(description) {
    super(description);

  }

  _createBodyElement() {
    return '<a href="#"> </a>';
  }
};
