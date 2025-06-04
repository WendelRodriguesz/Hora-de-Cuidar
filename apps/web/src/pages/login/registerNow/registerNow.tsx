import React from "react";
import styles from "./registerNow.module.scss"
import RegisterForm from "../../../components/RegisterForm/RegisterForm";

const RegisterNow: React.FC = () => {
    return (
        <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.recoveryPasswordimagesection}>
          <img src={"/src/assets/images/logoGrande.png"} alt="HDC Logo" />
        </div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.welcome}>Registre-se conosco</h2>
        {/* <p className={styles.subtitle}>Recupere para poder acessar a sua conta.</p> */}
        <RegisterForm/>
      </div>
    </div>
    );
}; 

export default RegisterNow;