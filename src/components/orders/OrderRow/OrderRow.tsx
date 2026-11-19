import type { OrderListItem } from "../../../types/order";
import { formatCents } from "../../../utils/formatCents";
import { formatDateTime } from "../../../utils/formatDateTime";
import { LinkButton } from "../../buttons/LinkButton";
import { OrderStatusLabel } from "../OrderStatusLabel/OrderStatusLabel";
import styles from "./OrderRow.module.css";

const orderTitle = (order: OrderListItem) => {
  if (!order.productTitle) return "Cancelled order";
  if (order.itemCount > 1) return `${order.productTitle} + ${order.itemCount - 1} more`;
  return order.productTitle;
};

interface OrderRowProps {
  order: OrderListItem;
}

export function OrderRow({ order }: OrderRowProps) {
  const title = orderTitle(order);

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>{formatDateTime(order.createdAt)}</td>
      <td className={styles.cell}>
        <OrderStatusLabel status={order.status} />
      </td>
      <td className={`${styles.cell} ${styles.title}`}>
        {title}
      </td>
      <td className={styles.cell}>{order.publicId}</td>
      <td className={styles.cell}>Credit or debit card</td>
      <td className={`${styles.cell} ${styles.amount}`}>
        {formatCents(order.totalCents, order.currency, "en-US")}
      </td>
      <td className={`${styles.cell} ${styles.details}`}>
        <LinkButton aria-label={`Details for order ${order.publicId}`}>Details</LinkButton>
      </td>
    </tr>
  );
}
