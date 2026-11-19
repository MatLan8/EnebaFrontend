import type { MouseEvent } from "react";
import { useCartActions } from "../../../hooks/useCartActions";
import { ErrorBox } from "../../ErrorBox/ErrorBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SellerInfo } from "../../seller/SellerInfo/SellerInfo";
import { CartIcon } from "../../../icons/CartIcon";
import type { Offer } from "../../../types/productDetail";
import { formatCents } from "../../../utils/formatCents";
import styles from "./SellerOfferCard.module.css";

interface SellerOfferCardProps {
  offer: Offer;
  basePriceCents: number;
  currency: string;
}

export function SellerOfferCard({ offer, basePriceCents, currency }: SellerOfferCardProps) {
  const { isPending, addAndOpen, buyNow, buyError, modal } = useCartActions(offer.id);
  const hasDiscount = offer.price.discountPercent !== null;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addAndOpen();
  };

  return (
    <article className={styles.card}>
      <SellerInfo seller={offer.seller} />
      <div className={styles.purchase}>
        <div className={styles.price}>
          {hasDiscount && (
            <p className={styles.compare}>
              <span className={styles.basePrice}>{formatCents(basePriceCents, currency)}</span>
              <span className={styles.percent}>-{offer.price.discountPercent}%</span>
            </p>
          )}
          <p className={styles.amount}>{formatCents(offer.price.cents, offer.price.currency)}</p>
        </div>
        <div className={styles.cartReveal}>
          <SecondaryButton
            aria-label={`Add ${offer.seller.name} offer to cart`}
            disabled={isPending}
            onClick={handleAddToCart}
          >
            <span aria-hidden="true">+</span>
            <CartIcon width={16} height={16} />
          </SecondaryButton>
        </div>
        <div className={styles.buy}>
          <SecondaryButton className={styles.buySecondary} disabled={isPending} onClick={buyNow}>
            Buy now
          </SecondaryButton>
          <PrimaryButton className={styles.buyPrimary} disabled={isPending} onClick={buyNow}>
            Buy now
          </PrimaryButton>
        </div>
      </div>
      {buyError && (
        <div className={styles.error}>
          <ErrorBox messages={[buyError]} fit />
        </div>
      )}
      {modal}
    </article>
  );
}
