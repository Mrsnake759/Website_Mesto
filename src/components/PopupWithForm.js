import Popup from "./Popup";

export default class PopupWithForm extends Popup {
  constructor(selector, formSubmitHandler) {
    super(selector);
    this._formSubmitHandler = formSubmitHandler;
    this._inputList = this._element.querySelectorAll(".popup__item");
    this._submitButton = this._element.querySelector(".popup__button");
    this._initButtonText = this._submitButton.textContent;
    this._form = this._element.querySelector(".popup__container");
  }

  getInputValues() {
    this._formValues = {};
    this._inputList.forEach(
      (input) => (this._formValues[input.name] = input.value)
    );
    return this._formValues;
  }

  setInputValues(data) {
    this._inputList.forEach((input) => {
      input.value = data[input.name] ? data[input.name] : "";
    });
  }

  switchSubmitButtonText(text) {
    this._submitButton.textContent = text;
    return this._initButtonText;
  }

  close() {
    this._form.reset();
    super.close();
  }

  setEventListeners() {
    super.setEventListeners();
    this._element.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._formSubmitHandler();
    });
  }
}
