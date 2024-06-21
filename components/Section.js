export default class Section {
  constructor( renderer, selector) {
    this._renderer = renderer;
    this._container = document.querySelector(selector);
  }

  _clear() {
    this._container.innerHTML = '';
  }

  addItem(item) {
    const card = this._renderer(item);
    this._container.prepend(card);
  }

  renderItems(items) {
    this._clear();

    items.reverse().forEach(item => {
      this.addItem(item);
    });
  }
}
