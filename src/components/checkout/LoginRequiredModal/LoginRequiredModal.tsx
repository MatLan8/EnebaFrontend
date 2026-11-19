import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import styles from "./LoginRequiredModal.module.css";

interface LoginRequiredModalProps {
  onClose: () => void;
}

export function LoginRequiredModal({ onClose }: LoginRequiredModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h2 id="login-required-title" className={styles.title}>
          Login required
        </h2>
        <p className={styles.text}>In order to checkout, you have to be logged-in.</p>
        <div className={styles.actions}>
          <SecondaryButton onClick={() => navigate(ROUTES.register)}>Register</SecondaryButton>
          <PrimaryButton onClick={() => navigate(ROUTES.login)}>Log in</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
