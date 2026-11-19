import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export function PrimaryButton({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={[styles.button, styles.primary, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
