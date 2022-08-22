import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import api from "../utils/Api";
import * as auth from "./../utils/auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import regOkImgPath from "../images/registration-ok.svg";
import regFailImgPath from "../images/registration-fail.svg";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [tooltipState, setTooltipState] = useState({
    isOpen: false,
    imgSrc: '',
    text: '',
  });
  const [userEmail, setUserEmail] = useState('');

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmAvatarPopupOpen, setIsConfirmAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // checkIfIsLogged();

    // if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, initialCards]) => {
        setCurrentUser(userData);
        setCards(initialCards);
        setIsLoggedIn(true);
        setUserEmail(userData.email);
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
    // }
  }, [isLoggedIn]);

  // const checkIfIsLogged = () => {
  //   api.checkIfIsLogged()
  //     .then((res) => {
  //       console.log(res);
  //       if (res.email) {
  //         setIsLoggedIn(true);
  //         setUserEmail(res.email);
  //         navigate('/');
  //       } else {
  //         navigate('/login');
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(`Ошибка! ${err}`);
  //     }) 
  // }

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.setItem('isUserLoged', false);
    navigate('/login');
}

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`)
      })
  }

  function handleAddPlaceSubmit(card) {
    api.postCard(card)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`)
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`)
      })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleUpdateUser({ name, about }) {
    api.setUserInfo({ name, about })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`)
      });
  }

  function handleUpdateAvatar({ avatarUrl }) {
    api.changeAvatar(avatarUrl)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`)
      });
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmAvatarPopupOpen(false);
    setSelectedCard({});
  }

  const closeTooltip = () => {
    setTooltipState((prev) => ({
      ...prev,
      isOpen: false,
    }));
    if (tooltipState.imgSrc === regOkImgPath) {
      setTimeout(() => {
        navigate('/signin');
      }, 444);
    }
  };

  const handleRegisterSubmit = (userData) => {
    auth.register(userData)
      .then((res) => {
        setUserEmail(res.email);
        setTooltipState({
          isOpen: true,
          imgSrc: regOkImgPath,
          text: "Вы успешно зарегистрировались!",
        });
      })
      .catch((err) => {
        console.log("error!", err);
        setTooltipState({
          isOpen: true,
          imgSrc: regFailImgPath,
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  };

  const handleLoginSubmit = (userData) => {
    auth.login(userData)
      .then((res) => {
        if (res.email) {
          setIsLoggedIn(true);
          localStorage.setItem('isUserLoged', true);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log("error!", err);
        setTooltipState({
          isOpen: true,
          imgSrc: regFailImgPath,
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  };

  return (
    <div className={`App root ${!isLoggedIn && 'root_notLoggedIn'}`}>
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={userEmail} handleSignOut={handleSignOut} />
    
        <Routes>
          <Route path='/signup' element={<Register onRegister={handleRegisterSubmit} />}/>
          <Route path='/signin' element={<Login onLogin={handleLoginSubmit} />}/>
          <Route exact path='/' element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
            
              <Main
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
              />
              <Footer />
              
            </ProtectedRoute>
          }/>
          <Route path='*' element={isLoggedIn ? <Navigate to='/' /> : <Navigate to='/signin' />}/>
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          title="Вы уверены?"
          name="confirm-popup"
          buttonText="Да"
          isOpen={isConfirmAvatarPopupOpen}
          onClose={closeAllPopups}
          // onSubmit='НАДО ВСТАВИТЬ'
        >
          <h2 className="popup__title popup__title_content_confirm">
            Вы уверены?
          </h2>
        </PopupWithForm>

        <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
        isOpen={tooltipState.isOpen}
        onClose={closeTooltip}
        imgSrc={tooltipState.imgSrc}
        title={tooltipState.text}
      />

      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
