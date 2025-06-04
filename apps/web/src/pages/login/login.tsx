import React from "react";
import styles from "./login.module.scss";
import LoginForm from "../../components/LoginForm/LoginForm";

const Login: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.loginimagesection}>
          <img src={"src/assets/images/logoGrande.png"} alt="HDC Logo" />
        </div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.welcome}>Bem-vindo!</h2>
        <p className={styles.subtitle}>Faça o login para poder acessar a sua conta.</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
3