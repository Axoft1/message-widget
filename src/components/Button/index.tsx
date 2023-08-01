import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children?: string | undefined;
  onClick: () => void;
  className: "start" | "close" | "names";
}

const Button = ({ children, onClick, className }: ButtonProps) => {
  return (
    <button onClick={onClick} className={styles[className]}>
      {children}
    </button>
  );
};

export default Button;
