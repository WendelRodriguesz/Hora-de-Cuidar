import React from "react";
import { FiLogOut } from "react-icons/fi";
import {  IoCogSharp } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsPeople,} from "react-icons/bs";
import { PiHeartbeatBold } from "react-icons/pi";
import { LuNotebookPen } from "react-icons/lu";
import SideBarItem  from "./sideBarItem";
import { IconType } from "react-icons"; 
import styles from "./sideBar.module.scss";


type MenuItem = {
  name: string;
  icon: IconType; // Tipo para componentes de ícone
  path: string;
};

const Sidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { name: "Painel", icon: MdOutlineSpaceDashboard, path: "/adminhome" },
    { name: "Agendamentos", icon: LuNotebookPen, path: "/students" },
    { name: "Pacientes", icon: BsPeople, path: "/adminwarnings" },
    { name: "Médicos", icon: PiHeartbeatBold, path: "/adminplans" },
  ];

  return (
    <div className={styles["sidebar"]}>
        <div className={styles.imagesection}>
            <img src={"src/assets/images/logoGrande.png"} alt="HDC Logo" />
        </div>
      <div className={styles["menu-items"]}>
        {menuItems.map((item) => (
          <SideBarItem key={item.name} {...item} />
        ))}
      </div>
      <div className={styles["footer"]}>
        <SideBarItem name="Sair" icon={FiLogOut} path="/" />
        <SideBarItem name="" icon={IoCogSharp} path="/settings" />
      </div>
    </div>
  );
};

export default Sidebar;
