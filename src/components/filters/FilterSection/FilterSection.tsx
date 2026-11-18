import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "../../../icons/ChevronIcon";
import styles from "./FilterSection.module.css";

interface FilterSectionProps {
  title: string;
  selectedCount: number;
  children: ReactNode;
}

export function FilterSection({
  title,
  selectedCount,
  children,
}: FilterSectionProps) {
  const [open, setOpen] = useState(true);
  const panelId = useId();

  return (
    <section className={open ? styles.section : `${styles.section} ${styles.closed}`}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.title}>{title}</span>
        {selectedCount > 0 && (
          <span className={styles.count}>{selectedCount}</span>
        )}
        <ChevronIcon className={open ? styles.chevronOpen : styles.chevron} />
      </button>
      <div id={panelId} className={open ? styles.panel : `${styles.panel} ${styles.panelClosed}`}>
        <div className={styles.panelInner} inert={!open}>
          {children}
        </div>
      </div>
    </section>
  );
}
