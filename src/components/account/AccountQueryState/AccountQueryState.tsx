import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { readApiErrors } from "../../../api/readApiErrors";
import { LoginRequiredModal } from "../../checkout/LoginRequiredModal/LoginRequiredModal";
import { Spinner } from "../../Spinner/Spinner";
import styles from "./AccountQueryState.module.css";

interface AccountQueryStateProps {
  isPending: boolean;
  error: Error | null;
  isEmpty: boolean;
  emptyMessage: string;
  loadingLabel: string;
  unauthorizedMessage: string;
  loginMessage: string;
  notFoundMessage?: string;
}

export function AccountQueryState({
  isPending,
  error,
  isEmpty,
  emptyMessage,
  loadingLabel,
  unauthorizedMessage,
  loginMessage,
  notFoundMessage,
}: AccountQueryStateProps) {
  const [loginDismissed, setLoginDismissed] = useState(false);
  const unauthorized = axios.isAxiosError(error) && error.response?.status === 401;

  if (isPending) {
    return (
      <div className={styles.loading}>
        <Spinner className={styles.spinner} label={loadingLabel} />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <>
        <p className={styles.message}>{unauthorizedMessage}</p>
        {!loginDismissed &&
          createPortal(
            <LoginRequiredModal message={loginMessage} onClose={() => setLoginDismissed(true)} />,
            document.body,
          )}
      </>
    );
  }

  if (notFoundMessage && axios.isAxiosError(error) && error.response?.status === 404) {
    return <p className={styles.message}>{notFoundMessage}</p>;
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        {readApiErrors(error).map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    );
  }

  if (isEmpty) return <p className={styles.message}>{emptyMessage}</p>;

  return null;
}
