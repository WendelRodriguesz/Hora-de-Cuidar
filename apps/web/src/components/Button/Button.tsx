import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Button.module.scss";

// Tipagem das props
type ButtonProps = {
  type?: "button" | "submit" | "reset"; 
  onClick?: () => void; 
  children: React.ReactNode; 
  navigateTo?: string;
};

export default function Button({ type = "button", onClick, children, navigateTo }: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    } else if (onClick) {
      onClick(); 
    }
  };

  return (
    <button type={type} onClick={handleClick} className={styles.button}>
      {children}
    </button>
  );
}
