import React, { ReactNode } from "react";
// import Sidebar from "../Admin/Sidebar/Sidebar";
// import Topbar from "../Topbar/Topbar";
import styles from "./Layout.module.scss";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles["layout"]}>
      {/* <Topbar /> */}
      <div className={styles["main-layout"]}>
        {/* <Sidebar /> */}
        <div className={styles["content"]}>{children}</div>
      </div>
    </div>
  );
}
