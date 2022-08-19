import React from "react";

const InfoTooltip = ({ isOpen, onClose, imgSrc, title }) => {

  return (
    <section className={`popup ${isOpen && 'popup_active'}`}>
      <div className="popup__container popup__container_content_info">
        <img className="popup__info-img" src={imgSrc} />
        <h2 className="popup__title popup__title_content_info">{title}</h2>
        <button
          className="popup__exit-btn link"
          type="button"
          aria-label="Выход"
          onClick={onClose}>
        </button>
      </div>
    </section>
  )
}

export default InfoTooltip;