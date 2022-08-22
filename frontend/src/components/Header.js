import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoPath from '../images/logo.svg';

const Header = ({ email, handleSignOut }) => {

  const location = useLocation();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const toggleMenu = () => {
    !isMenuOpened ? setIsMenuOpened(true) : setIsMenuOpened(false);
  }

  return (
    <header className="header">
      <section className={`header__content ${isMenuOpened && (location.pathname === '/') && 'header__content_menu-active'}`}>
        <Link to='/' className="header__logo">
          <img className="header__logo-img" src={logoPath} alt="Логотип: Место"/>
        </Link>
        <div className={`header__container ${(location.pathname === '/') && 'header__container_state_logged-in'} ${isMenuOpened && (location.pathname === '/') && 'header__container_active'}`}>
          {location.pathname === '/signin' && (
            <Link className="header__item link" to='/signup'>Регистрация</Link>
          )}
          {location.pathname === '/signup' && (
            <Link className="header__item link" to='/signin'>Вход</Link>
          )}
          {location.pathname === '/' && (
            <>
              <p className="header__item header__item_content_email link">{email}</p>
              <p className="header__item header__item_content_sign-out link" onClick={handleSignOut}>Выйти</p>
            </>
          )}
        </div>
        {location.pathname === '/' && (
          <div
            className={`header__burger link ${isMenuOpened && (location.pathname === '/') && 'header__burger_active'}`}
            onClick={toggleMenu}>
            <span className="header__burger-span"></span>
          </div>
        )}
      </section>
    </header>
  );
  }

export default Header;