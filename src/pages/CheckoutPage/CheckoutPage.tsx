import { useState } from "react";
import { createPortal } from "react-dom";
import { readApiErrors } from "../../api/readApiErrors";
import { useCheckout } from "../../api/useCheckout";
import { useGetCart } from "../../api/useGetCart";
import { getAccessToken } from "../../auth/accessToken";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { CheckoutCartItem } from "../../components/checkout/CheckoutCartItem/CheckoutCartItem";
import { CheckoutHeader } from "../../components/checkout/CheckoutHeader/CheckoutHeader";
import { LoginRequiredModal } from "../../components/checkout/LoginRequiredModal/LoginRequiredModal";
import { ErrorBox } from "../../components/ErrorBox/ErrorBox";
import { InfoCircleIcon } from "../../icons/InfoCircleIcon";
import { formatCents } from "../../utils/formatCents";
import styles from "./CheckoutPage.module.css";

export function CheckoutPage() {
  const cart = useGetCart(true);
  const checkout = useCheckout();
  const data = cart.data;
  const [loginOpen, setLoginOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const proceed = async () => {
    if (!getAccessToken()) {
      setLoginOpen(true);
      return;
    }

    setErrors([]);
    try {
      const result = await checkout.mutateAsync();
      window.location.href = result.checkoutUrl;
    } catch (error) {
      setErrors(readApiErrors(error));
    }
  };

  return (
    <>
      <CheckoutHeader activeStep={1} />
      <main className={styles.page}>
        {cart.isPending && <p className={styles.status}>Loading cart…</p>}
        {cart.error && <p className={styles.status}>Could not load your cart.</p>}
        {data && data.itemCount === 0 && (
          <section className={`${styles.panel} ${styles.empty}`}>
            <InfoCircleIcon className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Your shopping cart is empty</p>
            <p className={styles.emptyText}>It seems you haven&apos;t chosen your products yet</p>
          </section>
        )}
        {data && data.itemCount > 0 && (
          <div className={styles.layout}>
            <section className={styles.panel}>
              <h1 className={styles.heading}>My cart</h1>
              <ul className={styles.items}>
                {data.items.map((item) => (
                  <CheckoutCartItem key={item.offerId} item={item} />
                ))}
              </ul>
            </section>
            <aside className={`${styles.panel} ${styles.summary}`}>
              <h2 className={styles.heading}>Summary</h2>
              <PrimaryButton disabled={checkout.isPending} onClick={proceed}>
                {checkout.isPending && <span className={styles.spinner} aria-hidden="true" />}
                Proceed to checkout
              </PrimaryButton>
              <div className={styles.row}>
                <span>
                  {data.itemCount} {data.itemCount === 1 ? "product" : "products"}
                </span>
                <strong>{formatCents(data.totalCents, data.currency)}</strong>
              </div>
              <ErrorBox className={styles.errors} messages={errors} />
              <div className={styles.totalRow}>
                <span>Total:</span>
                <strong>{formatCents(data.totalCents, data.currency)}</strong>
              </div>
            </aside>
          </div>
        )}
      </main>
      {loginOpen &&
        createPortal(<LoginRequiredModal onClose={() => setLoginOpen(false)} />, document.body)}
    </>
  );
}
