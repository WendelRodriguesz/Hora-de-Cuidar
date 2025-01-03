import React from "react";
import styles from "./teste.module.scss";
import LoginForm from "../components/LoginForm/LoginForm";

const Teste: React.FC = () => {
  return (
    <div className={styles.container}>
    <LoginForm/>
    </div>
  );
};

export default Teste;
