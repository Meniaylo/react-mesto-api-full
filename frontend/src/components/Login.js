import React from "react";
import SignPage from "./SignPage";

const Login = ({onLogin}) => {

  return (
      <SignPage
        title="Вход"
        submitText="Войти"
        submitFunc={onLogin}
      />
  );
};

export default Login;
