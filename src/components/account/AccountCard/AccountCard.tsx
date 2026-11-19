import type { ReactNode } from "react";
import styles from "./AccountCard.module.css";

interface AccountCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function AccountCard({ title, icon, children }: AccountCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      {children}
    </section>
  );
}
