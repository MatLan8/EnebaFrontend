import type { ReactNode } from "react";
import styles from "./AccountTable.module.css";

type Align = "left" | "center" | "right";

const alignClass: Record<Align, string | undefined> = {
  left: undefined,
  center: styles.alignCenter,
  right: styles.alignRight,
};

export interface AccountTableColumn {
  key: string;
  label: string;
  hideLabel?: boolean;
  className?: string;
  align?: Align;
  media?: boolean;
}

interface AccountTableProps {
  columns: AccountTableColumn[];
  children: ReactNode;
}

export function AccountTable({ columns, children }: AccountTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} className={column.className} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={[styles.head, alignClass[column.align ?? "left"], column.media && styles.cellMedia]
                  .filter(Boolean)
                  .join(" ")}
                scope="col"
              >
                {column.hideLabel ? <span className={styles.hidden}>{column.label}</span> : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface AccountTableRowProps {
  children: ReactNode;
}

export function AccountTableRow({ children }: AccountTableRowProps) {
  return <tr className={styles.row}>{children}</tr>;
}

type CellVariant = "text" | "wrap" | "amount" | "media";

const variantClass: Record<CellVariant, string | undefined> = {
  text: undefined,
  wrap: styles.cellWrap,
  amount: styles.cellAmount,
  media: styles.cellMedia,
};

interface AccountTableCellProps {
  children?: ReactNode;
  variant?: CellVariant;
  align?: Align;
  flushStart?: boolean;
}

export function AccountTableCell({
  children,
  variant = "text",
  align = "left",
  flushStart = false,
}: AccountTableCellProps) {
  const className = [
    styles.cell,
    variantClass[variant],
    alignClass[align],
    flushStart && styles.flushStart,
  ]
    .filter(Boolean)
    .join(" ");

  return <td className={className}>{children}</td>;
}
