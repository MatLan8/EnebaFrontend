import { useNavigate } from "react-router-dom";
import { redeemKeysPath } from "../../../routes/paths";
import type { KeyListItem } from "../../../types/keys";
import { formatCents } from "../../../utils/formatCents";
import { formatDate } from "../../../utils/formatDateTime";
import { AccountTableCell, AccountTableRow } from "../../account/AccountTable/AccountTable";
import { LinkButton } from "../../buttons/LinkButton/LinkButton";
import styles from "./KeyRow.module.css";

interface KeyRowProps {
  item: KeyListItem;
}

export function KeyRow({ item }: KeyRowProps) {
  const navigate = useNavigate();

  return (
    <AccountTableRow>
      <AccountTableCell variant="media">
        <img className={styles.thumb} src={item.productImageUrl} alt="" />
      </AccountTableCell>
      <AccountTableCell>{formatDate(item.purchasedAt)}</AccountTableCell>
      <AccountTableCell>{item.publicId}</AccountTableCell>
      <AccountTableCell variant="wrap">{item.productTitle}</AccountTableCell>
      <AccountTableCell variant="wrap">{item.sellerName}</AccountTableCell>
      <AccountTableCell variant="amount">
        {formatCents(item.priceCents, item.currency, "en-US")}
      </AccountTableCell>
      <AccountTableCell align="center">
        <LinkButton
          aria-label={`View keys for ${item.productTitle}`}
          onClick={() => navigate(redeemKeysPath(item.orderId, item.id))}
        >
          View keys
        </LinkButton>
      </AccountTableCell>
    </AccountTableRow>
  );
}
