import type { ReactNode } from "react";
import { AccountHeader } from "../AccountHeader/AccountHeader";
import { AccountNav } from "../AccountNav/AccountNav";
import styles from "./AccountLayout.module.css";

interface AccountLayoutProps {
  children: ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className={styles.layout}>
      <AccountHeader />
      <div className={styles.body}>
        <AccountNav />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
