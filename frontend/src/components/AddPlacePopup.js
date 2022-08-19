import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

const AddPlacePopup = ({ isOpen, onClose, onAddPlace }) => {
  const [title, setTitle] = useState("");
  const [cardLink, setCardLink] = useState("");

  function handleTitleInputChange(evt) {
    setTitle(evt.target.value);
  }

  function handleCardLinkInputChange(evt) {
    setCardLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlace({ title, cardLink });    
  }

  return (
    <PopupWithForm
          title="Новое место"
          name="elements-popup"
          buttonText="Сохранить"
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
        >
          <>
            <div className="form__wrap">
              <input
                className="form__input"
                id="title-input"
                type="text"
                name="inputElementTitle"
                placeholder="Название"
                value={title || ''}
                minLength="2"
                maxLength="30"
                onChange={handleTitleInputChange}
                required
              />
              <span className="form__input-error title-input-error"></span>
            </div>
            <div className="form__wrap">
              <input
                className="form__input"
                id="link-input"
                type="url"
                name="inputElementLink"
                placeholder="Ссылка на картинку"
                value={cardLink || ''}
                onChange={handleCardLinkInputChange}
                required
              />
              <span className="form__input-error link-input-error"></span>
            </div>
          </>
        </PopupWithForm>
  )
}

export default AddPlacePopup;