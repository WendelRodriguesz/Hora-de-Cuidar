import React from "react";
import styles from "./login.module.scss";


const Login: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Lado esquerdo com o logo */}
      <div className={styles.left}>
        <h1 className={styles.logo}>
          HORA DE <br />
          <span className={styles.highlight}>CUIDAR</span>
        </h1>
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
          <button type="submit" className={styles.button}>
            Fazer Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
