import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCartActions } from "../../hooks/useCartActions";
import { productPath } from "../../routes/paths";
import type { ProductListItem } from "../../types/product";
import { formatCents } from "../../utils/formatCents";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const discountPercent = product.price.discountPercent;
  const hasDiscount = discountPercent !== null;
  const { isPending, addAndOpen, modal } = useCartActions(product.cheapestOfferId);

  const openProduct = () => navigate(productPath(product.slug));

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addAndOpen();
  };

  return (
    <article className={styles.card} onClick={openProduct}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={product.title}
        />
      </div>
      <div className={styles.panel}>
        <div className={styles.platform}>
          <img className={styles.platformIcon} src={product.platform.iconUrl} alt="" />
          <span>{product.platform.name}</span>
        </div>
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
            <PrimaryButton disabled={isPending} onClick={handleAddToCart}>
              Add to cart
            </PrimaryButton>
            <SecondaryButton>View offers</SecondaryButton>
          </div>
        </div>
      </div>
      {modal}
    </article>
  );
}
