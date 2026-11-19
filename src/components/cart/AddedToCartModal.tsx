import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartSuccessIcon } from "../../icons/CartSuccessIcon";
import { XCircleOutlineIcon } from "../../icons/XCircleOutlineIcon";
import { ROUTES } from "../../routes/paths";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { Spinner } from "../Spinner/Spinner";
import styles from "./AddedToCartModal.module.css";

interface AddedToCartModalProps {
  status: "pending" | "success" | "error";
  itemCount?: number;
  errorMessage?: string;
  onClose: () => void;
}

export function AddedToCartModal({
  status,
  itemCount = 0,
  errorMessage = "Something went wrong. Please try again.",
  onClose,
}: AddedToCartModalProps) {
  const navigate = useNavigate();

  const viewCart = () => {
    onClose();
    navigate(ROUTES.checkout);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const title =
    status === "pending" ? "Adding to cart" : status === "error" ? "Could not add to cart" : "Added to cart";

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="added-to-cart-title"
        aria-busy={status === "pending"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {status === "error" ? (
          <XCircleOutlineIcon className={`${styles.icon} ${styles.iconError}`} />
        ) : (
          <CartSuccessIcon className={styles.icon} />
        )}
        <h2 id="added-to-cart-title" className={styles.title}>
          {title}
        </h2>
        {status === "pending" && <Spinner className={styles.spinner} />}
        {status === "success" && (
          <p className={styles.text}>
            You have{" "}
            <strong>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </strong>{" "}
            in your cart
          </p>
        )}
        {status === "error" && (
          <p className={styles.text}>{errorMessage}</p>
        )}
        {status !== "pending" && (
          <div className={styles.actions}>
            <PrimaryButton onClick={onClose}>Continue shopping</PrimaryButton>
            <SecondaryButton onClick={viewCart}>View cart</SecondaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
