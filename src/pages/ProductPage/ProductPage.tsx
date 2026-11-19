import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useGetProduct } from "../../api/useGetProduct";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { FeaturedOffer } from "../../components/product/FeaturedOffer/FeaturedOffer";
import { SafeCheckout } from "../../components/product/SafeCheckout/SafeCheckout";
import { SellerOfferCard } from "../../components/product/SellerOfferCard/SellerOfferCard";
import { regionNames } from "../../constants/region";
import { CheckCircleOutlineIcon } from "../../icons/CheckCircleOutlineIcon";
import { KeyIcon } from "../../icons/KeyIcon";
import type { Offer } from "../../types/productDetail";
import styles from "./ProductPage.module.css";

const initialOtherOffers = 3;
const offerPageSize = 10;

const formatReleaseDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const detailValue = (value: string | null) => value?.trim() || "—";

function OtherOffers({
  offers,
  basePriceCents,
  currency,
}: {
  offers: Offer[];
  basePriceCents: number;
  currency: string;
}) {
  const [shown, setShown] = useState(initialOtherOffers);
  const visible = offers.slice(0, shown);
  const remaining = offers.length - visible.length;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {offers.length} other {offers.length === 1 ? "offer" : "offers"}
      </h2>
      <ul className={styles.offers}>
        {visible.map((offer) => (
          <li key={offer.id}>
            <SellerOfferCard offer={offer} basePriceCents={basePriceCents} currency={currency} />
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <div className={styles.moreWrap}>
          <SecondaryButton onClick={() => setShown((current) => current + offerPageSize)}>
            Load {remaining} more {remaining === 1 ? "offer" : "offers"}
          </SecondaryButton>
        </div>
      )}
    </section>
  );
}

export function ProductPage() {
  const { slug = "" } = useParams();
  const productQuery = useGetProduct(slug);
  const product = productQuery.data;
  const missing = axios.isAxiosError(productQuery.error) && productQuery.error.response?.status === 404;

  if (productQuery.isPending) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>Loading product…</p>
      </main>
    );
  }

  if (missing || !product) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>{missing ? "Product not found." : "Could not load this product."}</p>
      </main>
    );
  }

  const recommended = product.offers.slice(0, 2);
  const other = product.offers.slice(2);
  const cheapest = product.offers[0];
  const second = product.offers[1];

  const showOffers = () => {
    document.getElementById("recommended-sellers")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div>
      <section className={styles.hero}>
        <img className={styles.cover} src={product.imageUrl} alt="" />
        <div>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.facts}>
            <div className={styles.fact}>
              <CheckCircleOutlineIcon className={styles.factIcon} />
              <div>
                <p className={styles.factTitle}>{regionNames[product.region]}</p>
                <p className={styles.activation}>
                  <span>Can be activated in </span>
                  <strong>Lithuania</strong>
                </p>
              </div>
            </div>
            <div className={styles.fact}>
              <img className={styles.platformIcon} src={product.platform.iconUrl} alt="" />
              <div>
                <p className={styles.factTitle}>{product.platform.name}</p>
                <p className={styles.muted}>Activate/redeem on {product.platform.name}</p>
              </div>
            </div>
            <div className={styles.fact}>
              <KeyIcon className={`${styles.factIcon} ${styles.keyIcon}`} />
              <div>
                <p className={styles.muted}>This is a digital edition of the product (CD-KEY)</p>
                <p className={styles.instant}>Instant delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.offers.length === 0 ? (
        <p className={styles.status}>This product is out of stock.</p>
      ) : (
        <>
          <section id="recommended-sellers" className={`${styles.section} ${styles.offersAnchor}`}>
            <h2 className={styles.sectionTitle}>Recommended sellers</h2>
            <ul className={styles.offers}>
              {recommended.map((offer) => (
                <li key={offer.id}>
                  <SellerOfferCard
                    offer={offer}
                    basePriceCents={product.basePriceCents}
                    currency={product.currency}
                  />
                </li>
              ))}
            </ul>
          </section>
          {other.length > 0 && (
            <OtherOffers
              key={product.slug}
              offers={other}
              basePriceCents={product.basePriceCents}
              currency={product.currency}
            />
          )}
        </>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Product details</h2>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Other details</h2>
        <div className={styles.panel}>
          <p className={styles.meta}>
            <span className={styles.metaLabel}>Release date: </span>
            <span className={styles.metaValue}>{formatReleaseDate(product.releaseDate)}</span>
          </p>
          <p className={styles.meta}>
            <span className={styles.metaLabel}>Publisher: </span>
            <span className={styles.metaValue}>{detailValue(product.publisher)}</span>
          </p>
          <p className={styles.meta}>
            <span className={styles.metaLabel}>Developers: </span>
            <span className={styles.metaValue}>{detailValue(product.developer)}</span>
          </p>
        </div>
      </section>
        </div>
        <aside className={styles.side}>
          {cheapest && (
            <FeaturedOffer
              offer={cheapest}
              basePriceCents={product.basePriceCents}
              currency={product.currency}
              extraOfferCount={product.offers.length - 1}
              nextOfferCents={second?.price.cents}
              nextOfferCurrency={second?.price.currency}
              onShowOffers={showOffers}
            />
          )}
          <SafeCheckout />
        </aside>
      </div>
    </main>
  );
}
