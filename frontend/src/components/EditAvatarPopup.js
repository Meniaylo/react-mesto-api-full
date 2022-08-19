import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = ({ isOpen, onClose, onUpdateAvatar }) => {
  const avatarRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onUpdateAvatar({
        avatarUrl: avatarRef.current.value,
      });
      avatarRef.current.value = '';
  }
  
  return (
    <PopupWithForm
          title="Обновить аватар"
          name="newAvatar-popup"
          buttonText="Сохранить"
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
        >
          <div className="form__wrap">
            <input
              className="form__input"
              id="avatarLink-input"
              type="url"
              name="inputAvatarLink"
              placeholder="Ссылка на ваш аватар"
              ref={avatarRef}
              required
            />
            <span className="form__input-error avatarLink-input-error"></span>
          </div>
        </PopupWithForm>
  )
}


export default EditAvatarPopup;