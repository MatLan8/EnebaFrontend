import { useCartActions } from "../../../hooks/useCartActions";
import { ErrorBox } from "../../ErrorBox/ErrorBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { CartIcon } from "../../../icons/CartIcon";
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
  const { isPending, addAndOpen, buyNow, buyError, modal } = useCartActions(offer.id);
  const hasDiscount = offer.price.discountPercent !== null;

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
          <PrimaryButton disabled={isPending} onClick={buyNow}>
            Buy now
          </PrimaryButton>
          <SecondaryButton
            aria-label="Add featured offer to cart"
            disabled={isPending}
            onClick={addAndOpen}
          >
            <span aria-hidden="true">+</span>
            <CartIcon width={16} height={16} />
          </SecondaryButton>
        </div>
        {buyError && <ErrorBox className={styles.error} messages={[buyError]} fit />}
      </div>
      {extraOfferCount > 0 && nextOfferCents !== undefined && nextOfferCurrency && (
        <button type="button" className={styles.more} onClick={onShowOffers}>
          +{extraOfferCount} {extraOfferCount === 1 ? "offer" : "offers"} from{" "}
          {formatCents(nextOfferCents, nextOfferCurrency)}
        </button>
      )}
      {modal}
    </section>
  );
}
