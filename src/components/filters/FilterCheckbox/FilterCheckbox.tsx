import { useId } from "react";
import styles from "./FilterCheckbox.module.css";

interface FilterCheckboxProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
}: FilterCheckboxProps) {
  const id = useId();

  return (
    <label className={styles.label} htmlFor={id}>
      <input
        id={id}
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.box} />
      <span className={styles.name}>{label}</span>
      <span className={styles.count}>{count}</span>
    </label>
  );
}
