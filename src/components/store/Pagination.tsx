import { PageArrowIcon } from "../../icons/PageArrowIcon";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const pageItems = (totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages < 1) return null;

  const items = pageItems(totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pages">
      <button
        type="button"
        className={styles.arrow}
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <PageArrowIcon />
      </button>
      <ol className={styles.pages}>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              ...
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={item === page ? styles.pageActive : styles.page}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <PageArrowIcon />
      </button>
    </nav>
  );
}
