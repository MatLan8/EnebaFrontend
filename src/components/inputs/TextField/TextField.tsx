import type { InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

interface TextFieldProps extends Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "placeholder" | "type" | "autoComplete" | "name"
> {
  onChange: (value: string) => void;
}

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  name,
}: TextFieldProps) {
  return (
    <input
      className={styles.input}
      value={value}
      placeholder={placeholder}
      type={type}
      name={name}
      autoComplete={autoComplete}
      aria-label={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
