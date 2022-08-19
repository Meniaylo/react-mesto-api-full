import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleNameInputChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionInputChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateUser({
      name,
      about: description,
    });
  }

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
        title='Редактировать профиль'
        name='profile-popup'
        buttonText='Сохранить'
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}>
            <div className="form__wrap">
              <input
                className="form__input"
                id="name-input"
                type="text"
                name="inputName"
                value={name || ''}
                placeholder="Ваше имя"
                minLength="2"
                maxLength="40"
                required
                onChange={handleNameInputChange}
              />
              <span className="form__input-error name-input-error"></span>
            </div>
            <div className="form__wrap">
              <input
                className="form__input"
                id="occupation-input"
                type="text"
                name="inputOccupation"
                value={description || ''}
                placeholder="Род занятий"
                minLength="2"
                maxLength="200"
                required
                onChange={handleDescriptionInputChange}
              />
              <span className="form__input-error occupation-input-error"></span>
            </div>
          </PopupWithForm>
  );
}

export default EditProfilePopup;
