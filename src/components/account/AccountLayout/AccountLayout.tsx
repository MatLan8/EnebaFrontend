import type { ReactNode } from "react";
import { Footer } from "../../footer/Footer";
import { accountFooterColumns } from "../../footer/footerLinks";
import { AccountBreadcrumbs, type AccountBreadcrumb } from "../AccountBreadcrumbs/AccountBreadcrumbs";
import { AccountHeader } from "../AccountHeader/AccountHeader";
import { AccountNav } from "../AccountNav/AccountNav";
import styles from "./AccountLayout.module.css";

interface AccountLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: AccountBreadcrumb[];
  children: ReactNode;
}

export function AccountLayout({ title, subtitle, breadcrumbs, children }: AccountLayoutProps) {
  return (
    <div className={styles.layout}>
      <AccountHeader />
      <div className={styles.body}>
        <AccountNav />
        <div className={styles.column}>
          <main className={styles.content}>
            {breadcrumbs && <AccountBreadcrumbs items={breadcrumbs} />}
            {title && (
              <h1 className={subtitle ? `${styles.heading} ${styles.headingTight}` : styles.heading}>
                {title}
              </h1>
            )}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children}
          </main>
          <Footer variant="light" minimal columns={accountFooterColumns} />
        </div>
      </div>
    </div>
  );
}
