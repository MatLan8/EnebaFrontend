import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export function SecondaryButton({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={[styles.button, styles.secondary, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
