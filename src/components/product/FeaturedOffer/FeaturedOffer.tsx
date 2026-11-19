import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../../../api/useAddToCart";
import { AddedToCartModal } from "../../cart/AddedToCartModal";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { CartIcon } from "../../../icons/CartIcon";
import { ROUTES } from "../../../routes/paths";
import type { Offer } from "../../../types/productDetail";
import { formatCents } from "../../../utils/formatCents";
import styles from "./FeaturedOffer.module.css";

interface FeaturedOfferProps {
  offer: Offer;
  basePriceCents: number;
  currency: string;
  extraOfferCount: number;
  nextOfferCents?: number;
  nextOfferCurrency?: string;
  onShowOffers: () => void;
}

export function FeaturedOffer({
  offer,
  basePriceCents,
  currency,
  extraOfferCount,
  nextOfferCents,
  nextOfferCurrency,
  onShowOffers,
}: FeaturedOfferProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [buyError, setBuyError] = useState(false);
  const hasDiscount = offer.price.discountPercent !== null;

  const addAndOpen = () => {
    setBuyError(false);
    setModalOpen(true);
    addToCart.mutate(offer.id);
  };

  const buyNow = async () => {
    setBuyError(false);
    try {
      await addToCart.mutateAsync(offer.id);
      navigate(ROUTES.checkout);
    } catch {
      setBuyError(true);
    }
  };

  const modalStatus = addToCart.isPending ? "pending" : addToCart.isError ? "error" : "success";

  return (
    <section className={styles.card}>
      <div className={styles.body}>
        <p className={styles.label}>Featured offer</p>
        <div className={styles.price}>
          {hasDiscount && (
            <p className={styles.compare}>
              <span className={styles.basePrice}>{formatCents(basePriceCents, currency)}</span>
              <span className={styles.percent}>-{offer.price.discountPercent}%</span>
            </p>
          )}
          <p className={styles.amount}>{formatCents(offer.price.cents, offer.price.currency)}</p>
        </div>
        <div className={styles.actions}>
          <PrimaryButton disabled={addToCart.isPending} onClick={buyNow}>
            Buy now
          </PrimaryButton>
          <SecondaryButton
            aria-label="Add featured offer to cart"
            disabled={addToCart.isPending}
            onClick={addAndOpen}
          >
            <span aria-hidden="true">+</span>
            <CartIcon width={16} height={16} />
          </SecondaryButton>
        </div>
        {buyError && <p className={styles.error}>Could not add to cart</p>}
      </div>
      {extraOfferCount > 0 && nextOfferCents !== undefined && nextOfferCurrency && (
        <button type="button" className={styles.more} onClick={onShowOffers}>
          +{extraOfferCount} {extraOfferCount === 1 ? "offer" : "offers"} from{" "}
          {formatCents(nextOfferCents, nextOfferCurrency)}
        </button>
      )}
      {modalOpen &&
        createPortal(
          <AddedToCartModal
            status={modalStatus}
            itemCount={addToCart.data?.itemCount}
            onClose={() => setModalOpen(false)}
          />,
          document.body,
        )}
    </section>
  );
}
