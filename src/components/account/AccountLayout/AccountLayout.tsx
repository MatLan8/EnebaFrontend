import type { ReactNode } from "react";
import { Footer } from "../../footer/Footer";
import { accountFooterColumns } from "../../footer/footerLinks";
import { AccountHeader } from "../AccountHeader/AccountHeader";
import { AccountNav } from "../AccountNav/AccountNav";
import styles from "./AccountLayout.module.css";

interface AccountLayoutProps {
  title?: string;
  children: ReactNode;
}

export function AccountLayout({ title, children }: AccountLayoutProps) {
  return (
    <div className={styles.layout}>
      <AccountHeader />
      <div className={styles.body}>
        <AccountNav />
        <div className={styles.column}>
          <main className={styles.content}>
            {title && <h1 className={styles.heading}>{title}</h1>}
            {children}
          </main>
          <Footer variant="light" minimal columns={accountFooterColumns} />
        </div>
      </div>
    </div>
  );
}
