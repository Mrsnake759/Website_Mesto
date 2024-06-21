import "./index.css";
import Api from "../components/Api";
import Section from "../components/Section";
import Card from "../components/Card";
import UserInfo from "../components/UserInfo";
import PopupWithImage from "../components/PopupWithImage";
import PopupWithForm from "../components/PopupWithForm";
import FormValidator from "../components/FormValidator";
import { config } from "../utils/constants";

// DOM-элементы
const profile = document.querySelector(".profile");
const profileEditBbutton = profile.querySelector(".profile__edit-button");
const avatarEditButton = profile.querySelector(".profile__modify-button");
const profileAddBbutton = profile.querySelector(".profile__add-button");

// Создание объектов классов
const api = new Api({
  baseUrl: "https://nomoreparties.co/v1/plus-cohort-3",
  headers: {
    authorization: "02385e69-13e7-4a45-9c9c-ba6d7f7e0793",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo(
  {
    nameSelector: ".profile__title",
    aboutSelector: ".profile__subtitle",
    avatarSelector: ".profile__avatar",
  },
  {
    setUserHandler: function (name, about) {
      return api.editUser(name, about);
    },
  }
);

const cardSection = new Section((item) => {
  const userId = userInfo.getUserId();
  const card = new Card(
    item,
    ".elements-template",
    {
      handleCardClick: function () {
        popupImage.open(item);
      },
      handleDeleteBtnClick: function () {
        api
          .deleteCard(card.getId())
          .then(() => card.delete())
          .catch((err) => console.log(err));
      },
      handleLikeBtnClick: function () {
        if (!card.isLiked()) {
          api
            .putLike(card.getId())
            .then((data) => {
              card.updateLikes(data, true);
            })
            .catch((err) => console.log(err.message));
        } else {
          api
            .deleteLike(card.getId())
            .then((data) => {
              card.updateLikes(data);
            })
            .catch((err) => console.log(err.message));
        }
      },
    },
    userId
  );
  return card.generate();
}, ".elements");

const popupImage = new PopupWithImage(".image");

const popupEditProfile = new PopupWithForm(".edit-profile", function () {
  const oldText = popupEditProfile.switchSubmitButtonText("Сохранение...");
  const { name, about } = popupEditProfile.getInputValues();
  userInfo
    .setUserInfo(name, about)
    .then(() => {
      popupEditProfile.close();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupEditProfile.switchSubmitButtonText(oldText);
    });
});

const popupEditAvatar = new PopupWithForm(".avatar", function () {
  const oldText = popupEditAvatar.switchSubmitButtonText("Сохранение...");
  const { avatar } = popupEditAvatar.getInputValues();
  api
    .changeAvatar(avatar)
    .then((data) => {
      userInfo.setUserAvatar(data);
      popupEditAvatar.close();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupEditAvatar.switchSubmitButtonText(oldText);
    });
});

const popupAddPlace = new PopupWithForm(".place", function () {
  const oldText = popupAddPlace.switchSubmitButtonText("Сохранение...");
  const { name, link } = popupAddPlace.getInputValues();
  api
    .addNewCard(name, link)
    .then((card) => {
      cardSection.addItem(card);
      popupAddPlace.close();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupAddPlace.switchSubmitButtonText(oldText);
    });
});

const editProfileForm = new FormValidator(config, ".edit-profile__container");
const editAvatarForm = new FormValidator(config, ".avatar__container");
const addPlaceForm = new FormValidator(config, ".place__container");

// Установка обработчиков событий
popupImage.setEventListeners();
popupAddPlace.setEventListeners();
popupEditAvatar.setEventListeners();
popupEditProfile.setEventListeners();

profileEditBbutton.addEventListener("click", () => {
  const user = userInfo.getUserInfo();
  popupEditProfile.setInputValues(user);
  editProfileForm.clearForm();
  popupEditProfile.open();
});
avatarEditButton.addEventListener("click", () => {
  popupEditAvatar.open();
  editAvatarForm.clearForm();
});
profileAddBbutton.addEventListener("click", () => {
  popupAddPlace.open();
  addPlaceForm.clearForm();
});

// Начальная инициализация
Promise.all([api.getUser(), api.getCards()])
  .then(([user, items]) => {
    userInfo.setUserId(user._id);
    userInfo.showUserInfo(user);
    cardSection.renderItems(items);
  })
  .catch((err) => {
    console.log(err);
  });

editProfileForm.enableValidation();
editAvatarForm.enableValidation();
addPlaceForm.enableValidation();
