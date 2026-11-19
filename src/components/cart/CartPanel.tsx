import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { readApiErrorMessage } from "../../api/readApiErrors";
import { useCheckout } from "../../api/useCheckout";
import { useGetCart } from "../../api/useGetCart";
import { getAccessToken } from "../../auth/accessToken";
import { InfoCircleIcon } from "../../icons/InfoCircleIcon";
import { ROUTES } from "../../routes/paths";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { LoginRequiredModal } from "../checkout/LoginRequiredModal/LoginRequiredModal";
import { ErrorBox } from "../ErrorBox/ErrorBox";
import { formatCents } from "../../utils/formatCents";
import { CartItemCard } from "./CartItemCard";
import styles from "./CartPanel.module.css";

interface CartPanelProps {
  onClose: () => void;
}

export function CartPanel({ onClose }: CartPanelProps) {
  const cart = useGetCart(true);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const checkout = useCheckout();
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const viewCart = () => {
    onClose();
    navigate(ROUTES.checkout);
  };

  const checkoutNow = async () => {
    if (!getAccessToken()) {
      setLoginOpen(true);
      return;
    }

    setCheckoutError(null);
    try {
      const result = await checkout.mutateAsync();
      window.location.href = result.checkoutUrl;
    } catch (error) {
      setCheckoutError(readApiErrorMessage(error));
    }
  };

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Element;
      if (panelRef.current?.contains(target)) return;
      if (modalRef.current?.contains(target)) return;
      if (target.closest("[data-cart-toggle]")) return;
      onClose();
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  return (
    <>
      <div className={styles.backdrop} aria-hidden="true" />
      <div
        className={styles.panel}
        ref={panelRef}
        role="dialog"
        aria-label="My shopping cart"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>My shopping cart</h2>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {cart.isPending && <p className={styles.status}>Loading cart…</p>}
        {cart.error && <p className={styles.status}>Could not load your cart.</p>}
        {cart.data?.itemCount === 0 && (
          <div className={styles.empty}>
            <InfoCircleIcon className={styles.icon} />
            <p className={styles.emptyTitle}>Your shopping cart is empty</p>
            <p className={styles.emptyText}>It seems you haven&apos;t chosen your products yet</p>
          </div>
        )}
        {cart.data && cart.data.itemCount > 0 && (
          <>
            <ul className={styles.items}>
              {cart.data.items.map((item) => (
                <CartItemCard key={item.offerId} item={item} />
              ))}
            </ul>
            <div className={styles.summary}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.total}>
                  {formatCents(cart.data.totalCents, cart.data.currency)}
                </span>
              </div>
              <div className={styles.actions}>
                <PrimaryButton onClick={viewCart}>View cart</PrimaryButton>
                <SecondaryButton disabled={checkout.isPending} onClick={checkoutNow}>
                  Checkout now
                </SecondaryButton>
              </div>
              {checkoutError && <ErrorBox className={styles.checkoutError} messages={[checkoutError]} fit />}
            </div>
          </>
        )}
      </div>
      {loginOpen &&
        createPortal(
          <div ref={modalRef}>
            <LoginRequiredModal onClose={() => setLoginOpen(false)} />
          </div>,
          document.body,
        )}
    </>
  );
}
