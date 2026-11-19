import type { OrderListItem } from "../../../types/order";
import { AccountTable, type AccountTableColumn } from "../../account/AccountTable/AccountTable";
import { OrderRow } from "../OrderRow/OrderRow";
import styles from "./OrdersTable.module.css";

const columns: AccountTableColumn[] = [
  { key: "date", label: "Date", className: styles.column },
  { key: "status", label: "Status", className: styles.column },
  { key: "title", label: "Order title", className: styles.column },
  { key: "id", label: "Order ID", className: styles.column },
  { key: "payment", label: "Payment method", className: styles.paymentColumn },
  { key: "total", label: "Total amount", className: styles.column },
  { key: "actions", label: "Actions", hideLabel: true },
];

interface OrdersTableProps {
  orders: OrderListItem[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <AccountTable columns={columns}>
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </AccountTable>
  );
}
