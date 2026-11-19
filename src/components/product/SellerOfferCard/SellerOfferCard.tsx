import { useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { readApiErrorMessage } from "../../../api/readApiErrors";
import { useAddToCart } from "../../../api/useAddToCart";
import { ErrorBox } from "../../ErrorBox/ErrorBox";
import { AddedToCartModal } from "../../cart/AddedToCartModal";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SellerInfo } from "../../seller/SellerInfo/SellerInfo";
import { CartIcon } from "../../../icons/CartIcon";
import { ROUTES } from "../../../routes/paths";
import type { Offer } from "../../../types/productDetail";
import { formatCents } from "../../../utils/formatCents";
import styles from "./SellerOfferCard.module.css";

interface SellerOfferCardProps {
  offer: Offer;
  basePriceCents: number;
  currency: string;
}

export function SellerOfferCard({ offer, basePriceCents, currency }: SellerOfferCardProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const hasDiscount = offer.price.discountPercent !== null;

  const addAndOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setBuyError(null);
    setModalOpen(true);
    addToCart.mutate(offer.id);
  };

  const buyNow = async () => {
    setBuyError(null);
    try {
      await addToCart.mutateAsync(offer.id);
      navigate(ROUTES.checkout);
    } catch (error) {
      setBuyError(readApiErrorMessage(error));
    }
  };

  const modalStatus = addToCart.isPending ? "pending" : addToCart.isError ? "error" : "success";

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
            disabled={addToCart.isPending}
            onClick={addAndOpen}
          >
            <span aria-hidden="true">+</span>
            <CartIcon width={16} height={16} />
          </SecondaryButton>
        </div>
        <div className={styles.buy}>
          <SecondaryButton className={styles.buySecondary} disabled={addToCart.isPending} onClick={buyNow}>
            Buy now
          </SecondaryButton>
          <PrimaryButton className={styles.buyPrimary} disabled={addToCart.isPending} onClick={buyNow}>
            Buy now
          </PrimaryButton>
        </div>
      </div>
      {buyError && (
        <div className={styles.error}>
          <ErrorBox messages={[buyError]} fit />
        </div>
      )}
      {modalOpen &&
        createPortal(
          <AddedToCartModal
            status={modalStatus}
            itemCount={addToCart.data?.itemCount}
            errorMessage={addToCart.isError ? readApiErrorMessage(addToCart.error) : undefined}
            onClose={() => setModalOpen(false)}
          />,
          document.body,
        )}
    </article>
  );
}
