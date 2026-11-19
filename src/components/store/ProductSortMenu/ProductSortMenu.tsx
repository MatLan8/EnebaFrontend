import { useEffect, useRef, useState } from "react";
import { productSorts, type ProductSort } from "../../../constants/productSort";
import { ChevronIcon } from "../../../icons/ChevronIcon";
import { SortIcon } from "../../../icons/SortIcon";
import styles from "./ProductSortMenu.module.css";

interface ProductSortMenuProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
}

export function ProductSortMenu({ value, onChange }: ProductSortMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = productSorts.find((item) => item.value === value) ?? productSorts[4];

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className={styles.wrap} ref={rootRef}>
      <button
        type="button"
        className={styles.button}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <SortIcon className={styles.icon} ascending={current.ascending} />
        <span>{current.label}</span>
        <ChevronIcon className={open ? styles.chevronOpen : styles.chevron} />
      </button>
      {open && (
        <ul className={styles.menu}>
          {productSorts.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                className={item.value === value ? styles.optionActive : styles.option}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
