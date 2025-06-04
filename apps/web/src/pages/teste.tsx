import React from "react";
import styles from "./teste.module.scss";
import Sidebar from "../components/Professional/sideBar/sideBar";

const Teste: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar/>
    </div>
  );
};

export default Teste;
