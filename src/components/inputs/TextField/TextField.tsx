import type { InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

interface TextFieldProps extends Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "placeholder" | "type" | "autoComplete" | "name" | "maxLength"
> {
  onChange: (value: string) => void;
  variant?: "default" | "light";
  className?: string;
}

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  name,
  maxLength,
  variant = "default",
  className,
}: TextFieldProps) {
  return (
    <input
      className={[styles.input, variant === "light" && styles.light, className]
        .filter(Boolean)
        .join(" ")}
      value={value}
      placeholder={placeholder}
      type={type}
      name={name}
      autoComplete={autoComplete}
      maxLength={maxLength}
      aria-label={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
