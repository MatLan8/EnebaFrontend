import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { Modal } from "../../Modal/Modal";
import styles from "./LoginRequiredModal.module.css";

interface LoginRequiredModalProps {
  onClose: () => void;
  message?: string;
}

export function LoginRequiredModal({
  onClose,
  message = "In order to checkout, you have to be logged-in.",
}: LoginRequiredModalProps) {
  const navigate = useNavigate();


  return (
    <Modal className={styles.modal} labelledBy="login-required-title" onClose={onClose}>
      <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
        ×
      </button>
      <h2 id="login-required-title" className={styles.title}>
        Login required
      </h2>
      <p className={styles.text}>{message}</p>
      <div className={styles.actions}>
        <SecondaryButton onClick={() => navigate(ROUTES.register)}>Register</SecondaryButton>
        <PrimaryButton onClick={() => navigate(ROUTES.login)}>Log in</PrimaryButton>
      </div>
    </Modal>
  );
}
