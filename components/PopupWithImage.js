import Popup from "./Popup";

export default class PopupWithImage extends Popup {
  constructor(selector) {
    super(selector);
    this._imagePic = this._element.querySelector(".image__src");
    this._imageText = this._element.querySelector(".image__place");
  }

  open(item) {
    this._imagePic.src = item.link;
    this._imagePic.alt = `Иллюстрация места ${item.name}`;
    this._imageText.textContent = item.name;
    super.open();
  }
}
