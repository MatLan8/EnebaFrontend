import { useParams } from "react-router-dom";
import { useGetOrder } from "../../api/orders/useGetOrder";
import { AccountCard } from "../../components/account/AccountCard/AccountCard";
import { AccountLayout } from "../../components/account/AccountLayout/AccountLayout";
import { AccountQueryState } from "../../components/account/AccountQueryState/AccountQueryState";
import { AccountTable, type AccountTableColumn } from "../../components/account/AccountTable/AccountTable";
import { OrderItemRow } from "../../components/orders/OrderItemRow/OrderItemRow";
import { CheckCircleOutlineIcon } from "../../icons/CheckCircleOutlineIcon";
import { PendingCircleOutlineIcon } from "../../icons/PendingCircleOutlineIcon";
import { XCircleOutlineIcon } from "../../icons/XCircleOutlineIcon";
import { ROUTES } from "../../routes/paths";
import { formatCents } from "../../utils/formatCents";
import { formatDateTime } from "../../utils/formatDateTime";
import styles from "./OrderDetails.module.css";

const columns: AccountTableColumn[] = [
  { key: "products", label: "Ordered products" },
  { key: "status", label: "Delivery status" },
  { key: "actions", label: "Actions", hideLabel: true },
];

const breadcrumbs = [{ label: "Orders", to: ROUTES.orders }, { label: "Order" }];

const paymentStates = {
  paid: {
    title: "Payment complete",
    text: "Payment was completed successfully",
    className: styles.paid,
    Icon: CheckCircleOutlineIcon,
  },
  waiting: {
    title: "Waiting for payment",
    text: "Waiting for payment",
    className: styles.waiting,
    Icon: PendingCircleOutlineIcon,
  },
  cancelled: {
    title: "Order cancelled",
    text: "Order has been cancelled",
    className: styles.cancelled,
    Icon: XCircleOutlineIcon,
  },
};

export function OrderDetails() {
  const { id = "" } = useParams();
  const order = useGetOrder(id);
  const data = order.data;
  const paid = data?.paidAt != null;
  const payment = paymentStates[paid ? "paid" : data?.status === "cancelled" ? "cancelled" : "waiting"];

  return (
    <AccountLayout
      breadcrumbs={breadcrumbs}
      title={data ? `Order ${data.publicId}` : undefined}
      subtitle={data ? `Placed: ${formatDateTime(data.createdAt)}` : undefined}
    >
      <AccountQueryState
        isPending={order.isPending}
        error={order.error}
        isEmpty={false}
        emptyMessage=""
        loadingLabel="Loading order"
        unauthorizedMessage="Log in to see this order."
        loginMessage="To see your orders, you have to be logged-in."
        notFoundMessage="Order not found."
      />
      {data && (
        <>
          {data.items.length > 0 ? (
            <AccountTable columns={columns}>
              {data.items.map((item) => (
                <OrderItemRow key={item.id} orderId={data.id} status={data.status} item={item} />
              ))}
            </AccountTable>
          ) : (
            <p className={styles.empty}>This order has no products.</p>
          )}
          <AccountCard
            title="Payment details"
            icon={<payment.Icon className={`${styles.cardIcon} ${payment.className}`} />}
          >
            <p className={`${styles.paymentStatus} ${payment.className}`}>{payment.title}</p>
            <p className={styles.paymentText}>{payment.text}</p>
            {data.paidAt && (
              <dl className={styles.details}>
                <div className={styles.detail}>
                  <dt>Payment method:</dt>
                  <dd>Credit or debit card</dd>
                </div>
                <div className={styles.detail}>
                  <dt>Payment date:</dt>
                  <dd>{formatDateTime(data.paidAt)}</dd>
                </div>
                <div className={styles.detail}>
                  <dt>Payment collected on behalf of</dt>
                  <dd>{data.sellerNames.join(", ")}</dd>
                </div>
              </dl>
            )}
          </AccountCard>
          <AccountCard title="Order summary">
            <div className={styles.total}>
              <span>Total amount:</span>
              <strong>{formatCents(data.totalCents, data.currency, "en-US")}</strong>
            </div>
          </AccountCard>
        </>
      )}
    </AccountLayout>
  );
}
