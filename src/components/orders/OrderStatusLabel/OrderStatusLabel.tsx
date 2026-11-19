import type { OrderStatus } from "../../../types/order";
import styles from "./OrderStatusLabel.module.css";

const statusLabels: Record<OrderStatus, string> = {
  pending: "PENDING",
  paid: "ORDER FULFILLED",
  cancelled: "CANCELLED",
};

interface OrderStatusLabelProps {
  status: OrderStatus;
}

export function OrderStatusLabel({ status }: OrderStatusLabelProps) {
  return (
    <span className={`${styles.status} ${styles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
