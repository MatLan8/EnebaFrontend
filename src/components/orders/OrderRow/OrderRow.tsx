import { useNavigate } from "react-router-dom";
import { orderDetailsPath } from "../../../routes/paths";
import type { OrderListItem } from "../../../types/order";
import { formatCents } from "../../../utils/formatCents";
import { formatDateTime } from "../../../utils/formatDateTime";
import { AccountTableCell, AccountTableRow } from "../../account/AccountTable/AccountTable";
import { LinkButton } from "../../buttons/LinkButton";
import { OrderStatusLabel } from "../OrderStatusLabel/OrderStatusLabel";

const orderTitle = (order: OrderListItem) => {
  if (!order.productTitle) return "Cancelled order";
  if (order.itemCount > 1) return `${order.productTitle} + ${order.itemCount - 1} more`;
  return order.productTitle;
};

interface OrderRowProps {
  order: OrderListItem;
}

export function OrderRow({ order }: OrderRowProps) {
  const navigate = useNavigate();

  return (
    <AccountTableRow>
      <AccountTableCell>{formatDateTime(order.createdAt)}</AccountTableCell>
      <AccountTableCell>
        <OrderStatusLabel status={order.status} />
      </AccountTableCell>
      <AccountTableCell variant="wrap">{orderTitle(order)}</AccountTableCell>
      <AccountTableCell>{order.publicId}</AccountTableCell>
      <AccountTableCell>Credit or debit card</AccountTableCell>
      <AccountTableCell variant="amount">
        {formatCents(order.totalCents, order.currency, "en-US")}
      </AccountTableCell>
      <AccountTableCell align="right" flushStart>
        <LinkButton
          aria-label={`Details for order ${order.publicId}`}
          onClick={() => navigate(orderDetailsPath(order.id))}
        >
          Details
        </LinkButton>
      </AccountTableCell>
    </AccountTableRow>
  );
}
