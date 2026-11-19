import type { OrderListItem } from "../../../types/order";
import { OrderRow } from "../OrderRow/OrderRow";
import styles from "./OrdersTable.module.css";

const columns = [
  { label: "Date", className: styles.column },
  { label: "Status", className: styles.column },
  { label: "Order title", className: styles.column },
  { label: "Order ID", className: styles.column },
  { label: "Payment method", className: styles.paymentColumn },
  { label: "Total amount", className: styles.column },
];

interface OrdersTableProps {
  orders: OrderListItem[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.label} className={column.className} />
          ))}
          <col />
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label} className={styles.head} scope="col">
                {column.label}
              </th>
            ))}
            <th className={styles.head} scope="col">
              <span className={styles.hidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
