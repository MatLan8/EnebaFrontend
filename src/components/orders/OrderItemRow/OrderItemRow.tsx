import { useNavigate } from "react-router-dom";
import { redeemKeysPath } from "../../../routes/paths";
import type { OrderDetailItem, OrderStatus } from "../../../types/order";
import { formatCents } from "../../../utils/formatCents";
import { AccountTableCell, AccountTableRow } from "../../account/AccountTable/AccountTable";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { OrderStatusLabel } from "../OrderStatusLabel/OrderStatusLabel";
import styles from "./OrderItemRow.module.css";

interface OrderItemRowProps {
  orderId: string;
  status: OrderStatus;
  item: OrderDetailItem;
}

export function OrderItemRow({ orderId, status, item }: OrderItemRowProps) {
  const navigate = useNavigate();

  return (
    <AccountTableRow>
      <AccountTableCell variant="wrap">
        <div className={styles.product}>
          <img className={styles.image} src={item.imageUrl} alt="" />
          <div className={styles.info}>
            <p className={styles.title}>{item.title}</p>
            <p className={styles.price}>{formatCents(item.unitPriceCents, item.currency, "en-US")}</p>
            <p className={styles.muted}>
              Vendor: <span className={styles.seller}>{item.sellerName}</span>
            </p>
            <p className={styles.muted}>
              Your order was fulfilled by <span className={styles.seller}>{item.sellerName}</span> via
              the Eneba platform
            </p>
          </div>
        </div>
      </AccountTableCell>
      <AccountTableCell>
        <OrderStatusLabel status={status} showIcon />
      </AccountTableCell>
      <AccountTableCell>
        <div className={styles.action}>
          <PrimaryButton
            className={styles.viewKey}
            disabled={status !== "paid"}
            onClick={() => navigate(redeemKeysPath(orderId))}
          >
            View Key
          </PrimaryButton>
        </div>
      </AccountTableCell>
    </AccountTableRow>
  );
}
