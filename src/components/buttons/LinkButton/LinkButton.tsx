import type { ButtonHTMLAttributes } from "react";
import styles from "./LinkButton.module.css";

export function LinkButton({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={[styles.link, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
