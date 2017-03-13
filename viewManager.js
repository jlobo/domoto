const singleton = Symbol();
const singletonEnforcer = Symbol();

module.exports = class ViewManager {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer)
      throw new Error('Cannot construct singleton');

    this.visible = null;
    this.views = new Set();
  }

  static get instance() {
    if (!this[singleton])
      this[singleton] = new ViewManager(singletonEnforcer);

    return this[singleton];
  }

  setVisible(view) {
    if (this.visible)
      this.visible.hide();

    this.visible = view;
    view.show();
  }

  show(view) {
    if (!this.visible)
      view.once('load', () => this.setVisible(view));

    this.views.add(view);
    return this.setVisible.bind(this, view);
  }

  hide(...views) {
    views.forEach(view => this.views.delete(view));
    if (views.every(view => view !== this.visible))
      return;

    this.setVisible(this.views.values().next().value);
  }
};
