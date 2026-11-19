import type { ComponentType, SVGProps } from "react";
import { CheckCircleOutlineIcon } from "../../../icons/CheckCircleOutlineIcon";
import { PendingCircleOutlineIcon } from "../../../icons/PendingCircleOutlineIcon";
import { XCircleOutlineIcon } from "../../../icons/XCircleOutlineIcon";
import type { OrderStatus } from "../../../types/order";
import styles from "./OrderStatusLabel.module.css";

const statusLabels: Record<OrderStatus, string> = {
  pending: "PENDING",
  paid: "ORDER FULFILLED",
  cancelled: "CANCELLED",
};

const statusIcons: Record<OrderStatus, ComponentType<SVGProps<SVGSVGElement>>> = {
  pending: PendingCircleOutlineIcon,
  paid: CheckCircleOutlineIcon,
  cancelled: XCircleOutlineIcon,
};

interface OrderStatusLabelProps {
  status: OrderStatus;
  showIcon?: boolean;
}

export function OrderStatusLabel({ status, showIcon = false }: OrderStatusLabelProps) {
  const Icon = statusIcons[status];

  return (
    <span className={[styles.status, styles[status], showIcon && styles.withIcon].filter(Boolean).join(" ")}>
      {showIcon && <Icon className={styles.icon} />}
      {statusLabels[status]}
    </span>
  );
}
