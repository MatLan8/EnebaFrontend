import { useRemoveCartItem } from "../../../api/useRemoveCartItem";
import { useUpdateCartItem } from "../../../api/useUpdateCartItem";
import { TrashIcon } from "../../../icons/GarbageIcon";
import type { CartItem } from "../../../types/cart";
import { formatCents } from "../../../utils/formatCents";
import styles from "./CheckoutCartItem.module.css";

const maxQuantity = 10;

interface CheckoutCartItemProps {
  item: CartItem;
}

export function CheckoutCartItem({ item }: CheckoutCartItemProps) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const busy = updateItem.isPending || removeItem.isPending;
  const quantityLimit = Math.min(maxQuantity, item.availableQuantity);

  const changeQuantity = (quantity: number) => {
    updateItem.mutate({ offerId: item.offerId, quantity });
  };

  return (
    <li className={busy ? `${styles.item} ${styles.busy}` : styles.item}>
      <img className={styles.image} src={item.product.imageUrl} alt="" />
      <div className={styles.details}>
        <div className={styles.topRow}>
          <span className={styles.seller}>
            Sold by
            {item.seller.logoUrl ? (
              <img className={styles.sellerLogo} src={item.seller.logoUrl} alt="" />
            ) : (
              <span className={styles.sellerFallback} aria-hidden="true">
                {item.seller.name.charAt(0)}
              </span>
            )}
            <strong>{item.seller.name}</strong>
          </span>
          <button
            type="button"
            className={styles.remove}
            aria-label={`Remove ${item.product.title} from cart`}
            disabled={busy}
            onClick={() => removeItem.mutate(item.offerId)}
          >
            <TrashIcon />
          </button>
        </div>
        <p className={styles.title}>
          {item.product.isDlc && <span className={styles.dlc}>DLC</span>}
          {item.product.title}
        </p>
        {!item.available && (
          <p className={styles.warning}>
            {item.availableQuantity === 0
              ? "This offer is no longer available. Please remove it."
              : `Only ${item.availableQuantity} left. Please lower the quantity.`}
          </p>
        )}
        {(updateItem.isError || removeItem.isError) && (
          <p className={styles.warning} role="alert">
            Could not update this item.
          </p>
        )}
        <div className={styles.bottomRow}>
          <span className={styles.digital}>Digital product</span>
          <div className={styles.quantity}>
            <button
              type="button"
              className={styles.step}
              aria-label="Decrease quantity"
              disabled={busy || item.quantity <= 1}
              onClick={() => changeQuantity(item.quantity - 1)}
            >
              −
            </button>
            <span className={styles.count} aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              className={styles.step}
              aria-label="Increase quantity"
              disabled={busy || item.quantity >= quantityLimit}
              onClick={() => changeQuantity(item.quantity + 1)}
            >
              +
            </button>
          </div>
          <span className={styles.price}>{formatCents(item.priceCents, item.currency)}</span>
        </div>
      </div>
    </li>
  );
}
