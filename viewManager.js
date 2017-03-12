const singleton = Symbol();
const singletonEnforcer = Symbol();

module.exports = class ViewManager {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer)
      throw new Error('Cannot construct singleton');

    this.visible = { extension: null, view: null };
    this.views = new Map();
  }

  static get instance() {
    if (!this[singleton])
      this[singleton] = new ViewManager(singletonEnforcer);

    return this[singleton];
  }

  remove(extension) {
    this.views.delete(extension);
    if (this.visible.extension !== extension)
      return;

    extension = this.views.keys().next().value;
    this.show(extension, this.views.get(extension)[0]);
  }

  show(extension, view) {
    if (this.visible.view)
      this.visible.view.hide();

    this.visible.extension = extension;
    this.visible.view = view;
    view.show();
  }

  add(extension, view) {
    if (!this.visible.view)
      view.once('load', () => this.show(extension, view));

    if (this.views.has(extension))
      this.views.get(extension).push(view);
    else
      this.views.set(extension, [view]);

    return this.show.bind(this, extension, view);
  }
};
