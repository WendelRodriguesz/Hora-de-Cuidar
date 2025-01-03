import React from "react";
import styles from "./login.module.scss";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/patients"); // Navega para "/dashboard"
  };

  return (
    <div className={styles.container}>
      {/* Lado esquerdo com o logo */}
        <div className={styles.left}>
            <div className={styles.loginimagesection}>
                <img src={"src/assets/images/logoGrande.png"} alt="HDC Logo" />
            </div>
        </div>

      {/* Lado direito com o formulário */}
      <div className={styles.right}>
        <h2 className={styles.welcome}>Bem-vindo!</h2>
        <p className={styles.subtitle}>Faça o login para poder acessar a sua conta.</p>

        <form className={styles.form}>
          <input type="text" placeholder="CPF" className={styles.input} />
          <input type="password" placeholder="Senha" className={styles.input} />
          <a href="#" className={styles.forgotPassword}>
            Esqueci Minha Senha
          </a>
          <button onClick={handleButtonClick} type="submit" className={styles.button}>
            Fazer Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
