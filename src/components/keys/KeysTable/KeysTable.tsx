import type { KeyListItem } from "../../../types/keys";
import { AccountTable, type AccountTableColumn } from "../../account/AccountTable/AccountTable";
import { KeyRow } from "../KeyRow/KeyRow";
import styles from "./KeysTable.module.css";

const columns: AccountTableColumn[] = [
  { key: "image", label: "Product image", hideLabel: true, media: true, className: styles.imageColumn },
  { key: "date", label: "Date" },
  { key: "orderId", label: "Order ID" },
  { key: "product", label: "Product name", className: styles.productColumn },
  { key: "seller", label: "Seller" },
  { key: "price", label: "Price" },
  { key: "actions", label: "Actions", hideLabel: true },
];

interface KeysTableProps {
  items: KeyListItem[];
}

export function KeysTable({ items }: KeysTableProps) {
  return (
    <AccountTable columns={columns}>
      {items.map((item) => (
        <KeyRow key={item.id} item={item} />
      ))}
    </AccountTable>
  );
}
