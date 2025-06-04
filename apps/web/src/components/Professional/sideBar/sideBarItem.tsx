import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IconType } from "react-icons"; 
import styles from "./sideBar.module.scss";
import { toast } from "react-toastify";

type SidebarItemProps = {
  name: string; // Nome do item da sidebar
  icon: IconType; // Tipo para ícones (React-icons)
  path: string; // Caminho para a rota
  className?: string; // Classe CSS opcional
};

const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon: Icon, path, className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (name === "Sair") {
      const rememberMe = localStorage.getItem("rememberMe") === "true";

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!rememberMe) {
        localStorage.removeItem("cpf");
        localStorage.removeItem("rememberMe");
      }

      sessionStorage.clear();

      toast.info("Você foi desconectado!", {
        position: "top-right",
      });
      navigate("/");
    }
  };

  return (
    <NavLink
      to={path}
      onClick={handleLogout}
      className={({ isActive }) =>
        `${styles['sidebar-item']} ${isActive ? styles['active'] : ''}`
      }
    >
      <div className={styles["icon-wrapper"]}>
        <Icon size={20} />
      </div>
      {name && <span>{name}</span>}
    </NavLink>
  );
};

export default SidebarItem;
