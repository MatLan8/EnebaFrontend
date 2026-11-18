import type { ProductListItem } from "../../types/product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductListItem;
}

const formatCents = (cents: number, currency: string) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
  });

export function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.price.discountPercent;
  const hasDiscount = discountPercent !== null;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={product.title}
        />
      </div>
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.title}>{product.title}</p>
          <p className={styles.region}>{product.region.replaceAll("_", " ")}</p>
        </div>
        <div className={styles.price}>
          <p className={styles.fromRow}>
            <span>From</span>
            {hasDiscount && (
              <>
                <span className={styles.basePrice}>
                  {formatCents(product.basePriceCents, product.currency)}
                </span>
                <span className={styles.percent}>-{discountPercent}%</span>
              </>
            )}
          </p>
          <p className={styles.amount}>
            {formatCents(
              hasDiscount ? product.price.cents : product.basePriceCents,
              hasDiscount ? product.price.currency : product.currency,
            )}
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.addToCart}`}
            >
              Add to cart
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.viewOffers}`}
            >
              View offers
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
