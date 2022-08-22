import { Link } from "react-router-dom";
import SignPage from "./SignPage";


const Register = ({onRegister}) => {

  return (
      <SignPage
        title="Регистрация"
        submitText="Зарегистрироваться"
        submitFunc={onRegister}
      >
        <div className="sign-page__register-container">
          <p className="sign-page__register-text">Уже зарегистрированы?</p>
          <Link to="/signin" className="sign-page__register-text link">
            Войти
          </Link>
        </div>
      </SignPage>
  );
};

export default Register;
