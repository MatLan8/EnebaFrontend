import { useState } from "react";
import { createPortal } from "react-dom";
import { useAddToCart } from "../../api/useAddToCart";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import type { ProductListItem } from "../../types/product";
import { AddedToCartModal } from "../cart/AddedToCartModal";
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
  const addToCart = useAddToCart();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddToCart = () => {
    setModalOpen(true);
    addToCart.mutate(product.cheapestOfferId);
  };

  const modalStatus = addToCart.isPending ? "pending" : addToCart.isError ? "error" : "success";

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
            <PrimaryButton disabled={addToCart.isPending} onClick={handleAddToCart}>
              Add to cart
            </PrimaryButton>
            <SecondaryButton>View offers</SecondaryButton>
          </div>
        </div>
      </div>
      {modalOpen &&
        createPortal(
          <AddedToCartModal
            status={modalStatus}
            itemCount={addToCart.data?.itemCount}
            onClose={() => setModalOpen(false)}
          />,
          document.body,
        )}
    </article>
  );
}
