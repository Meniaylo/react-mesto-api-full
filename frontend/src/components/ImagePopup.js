import React from "react";

const ImagePopup = ({selectedCard, onClose}) => (
    <section
      className={`popup popup_content_img ${selectedCard.name && 'popup_active'}`}
      id={selectedCard.name}>
      <div className="popup__img-container">
        <img
          className="popup__img"
          src={selectedCard?.link}
          alt={selectedCard.name}/>
        <h2 className="popup__img-title">{selectedCard.name}</h2>
        <button
          className="popup__exit-btn link"
          type="button"
          aria-label="Выход"
          onClick={onClose}>
        </button>
      </div>
    </section>
  );

export default ImagePopup;