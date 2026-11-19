import type { ProductSuggestion } from "../../../types/productSuggestions";
import styles from "./SearchSuggestionCard.module.css";

interface SearchSuggestionCardProps {
  product: ProductSuggestion;
  onSelect: (product: ProductSuggestion) => void;
}

const formatCents = (cents: number, currency: string) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
  });

export function SearchSuggestionCard({ product, onSelect }: SearchSuggestionCardProps) {
  const samePrice = product.basePriceCents === product.price.cents;

  return (
    <button type="button" className={styles.card} onClick={() => onSelect(product)}>
      <img className={styles.image} src={product.imageUrl} alt="" />
      <span className={styles.details}>
        <span className={styles.pill}>Digital good</span>
        <span className={styles.title}>
          {product.isDlc && <span className={styles.dlc}>DLC</span>}
          {product.title}
        </span>
      </span>
      <span className={styles.price}>
        <span className={styles.fromRow}>
          <span>From</span>
          {!samePrice && (
            <span className={styles.basePrice}>
              {formatCents(product.basePriceCents, product.currency)}
            </span>
          )}
        </span>
        <span className={styles.amount}>
          {formatCents(product.price.cents, product.price.currency)}
        </span>
      </span>
    </button>
  );
}
