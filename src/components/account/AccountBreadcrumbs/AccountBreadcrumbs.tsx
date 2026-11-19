import { Link } from "react-router-dom";
import styles from "./AccountBreadcrumbs.module.css";

export interface AccountBreadcrumb {
  label: string;
  to?: string;
}

interface AccountBreadcrumbsProps {
  items: AccountBreadcrumb[];
}

export function AccountBreadcrumbs({ items }: AccountBreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.label} className={styles.item}>
            {index > 0 && <span className={styles.dot} aria-hidden="true" />}
            {item.to ? (
              <Link className={styles.link} to={item.to}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
