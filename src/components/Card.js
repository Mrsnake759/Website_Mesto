export default class Card {
  constructor(
    { _id, name, link, likes, owner },
    selector,
    { handleCardClick, handleDeleteBtnClick, handleLikeBtnClick },
    userId
  ) {
    this._id = _id;
    this._name = name;
    this._link = link;
    this._likes = likes;
    this._owner = owner;
    this._userId = userId;
    this._selector = selector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteBtnClick = handleDeleteBtnClick;
    this._handleLikeBtnClick = handleLikeBtnClick;
    this._element = this._getElement();
    this._deleteButton = this._element.querySelector(".element__delete");
    this._likeButton = this._element.querySelector(".element__like");
    this._numberLike = this._element.querySelector(".element__number-like");
    this._elementImage = this._element.querySelector(".element__image");
    this._elementText = this._element.querySelector(".element__text");
  }

  getId() {
    return this._id;
  }

  isLiked() {
    return this._likeButton.classList.contains("element__like_active");
  }

  updateLikes(data, isActive = false) {
    if (isActive) {
      this._likeButton.classList.add("element__like_active");
    } else {
      this._likeButton.classList.remove("element__like_active");
    }
    this._numberLike.textContent = data.likes.length;
  }

  delete() {
    this._element.remove();
  }

  _getElement() {
    const cardElement = document
      .querySelector(this._selector)
      .content.querySelector(".element")
      .cloneNode(true);

    return cardElement;
  }

  _setEventListeners() {
    this._deleteButton.addEventListener("click", () =>
      this._handleDeleteBtnClick()
    );
    this._likeButton.addEventListener("click", (evt) =>
      this._handleLikeBtnClick(evt)
    );
    this._elementImage.addEventListener("click", () => this._handleCardClick());
  }

  generate() {
    this._elementText.textContent = this._name;
    this._elementImage.src = this._link;
    this._elementImage.alt = `Иллюстрация места ${this._name}`;
    this._numberLike.textContent = this._likes.length;

    if (this._userId === this._owner._id) {
      this._deleteButton.classList.add("element__delete_visible");
    } else {
      this._deleteButton.classList.remove("element__delete_visible");
    }

    if (this._likes.map((like) => like._id).includes(this._userId)) {
      this._likeButton.classList.add("element__like_active");
    }

    this._setEventListeners();
    return this._element;
  }
}
