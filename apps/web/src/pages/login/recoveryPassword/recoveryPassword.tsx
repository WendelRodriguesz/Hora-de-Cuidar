import React from "react";
import styles from "./recoveryPassword.module.scss";
import RecoveryForm from "../../../components/RecoveryForm/RecoveryForm";

const RecoveryPassword: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.recoveryPasswordimagesection}>
          <img src={"/src/assets/images/logoGrande.png"} alt="HDC Logo" />
        </div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.welcome}>Esqueceu sua senha?</h2>
        <p className={styles.subtitle}>Recupere para poder acessar a sua conta.</p>
        <RecoveryForm/>
      </div>
    </div>
  );
};

export default RecoveryPassword;
3