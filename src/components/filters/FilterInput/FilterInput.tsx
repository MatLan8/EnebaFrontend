import type { InputHTMLAttributes } from "react";
import { SearchIcon } from "../../../icons/SearchIcon";
import styles from "./FilterInput.module.css";

interface FilterInputProps extends Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "placeholder" | "inputMode"
> {
  label: string;
  onChange: (value: string) => void;
  icon?: boolean;
}

export function FilterInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  icon = false,
}: FilterInputProps) {
  return (
    <div className={icon ? styles.search : styles.field}>
      <input
        className={styles.input}
        value={value}
        placeholder={placeholder}
        aria-label={label}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
      />
      {icon && <SearchIcon className={styles.icon} />}
    </div>
  );
}
