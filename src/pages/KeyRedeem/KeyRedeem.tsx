import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { readApiErrors } from "../../api/core/readApiErrors";
import { useGetOrderKeys } from "../../api/orders/useGetOrderKeys";
import type { ApiError } from "../../types/apiError";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { CheckoutHeader } from "../../components/checkout/CheckoutHeader/CheckoutHeader";
import { LoginRequiredModal } from "../../components/checkout/LoginRequiredModal/LoginRequiredModal";
import { ProductKeyCard } from "../../components/keys/ProductKeyCard/ProductKeyCard";
import { Spinner } from "../../components/Spinner/Spinner";
import { AlertCircleIcon } from "../../icons/AlertCircleIcon";
import { InfoCircleIcon } from "../../icons/InfoCircleIcon";
import styles from "./KeyRedeem.module.css";

type OrderKeysError = "unauthorized" | "pending" | "cancelled" | "unknown";

const errorCopy: Record<OrderKeysError, { title: string; text: string; retry: boolean }> = {
  unauthorized: {
    title: "Login required",
    text: "Log in to see the keys from this order.",
    retry: false,
  },
  pending: {
    title: "Payment not completed yet",
    text: "We’re still confirming your payment. Your keys will appear here once it’s done.",
    retry: true,
  },
  cancelled: {
    title: "Order cancelled",
    text: "This order was cancelled, so there are no keys to show.",
    retry: false,
  },
  unknown: {
    title: "Could not load your keys",
    text: "Something went wrong. Please try again.",
    retry: true,
  },
};

const readOrderKeysError = (error: unknown): OrderKeysError => {
  if (!axios.isAxiosError<ApiError>(error)) return "unknown";
  const status = error.response?.status;
  const body = error.response?.data?.error;
  if (status === 401) return "unauthorized";
  if (status === 409 && body?.code === "order_not_paid") {
    return body.details?.status === "cancelled" ? "cancelled" : "pending";
  }
  return "unknown";
};

const readOrderId = (hash: string) => {
  const raw = hash.replace(/^#/, "");
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
};

export function KeyRedeem() {
  const location = useLocation();
  const orderId = readOrderId(location.hash);

  return (
    <>
      <CheckoutHeader activeStep={3} />
      <main className={styles.page}>
        <h1 className={styles.heading}>Get your product</h1>
        {orderId ? (
          <OrderKeys key={orderId} orderId={orderId} />
        ) : (
          <StatusPanel
            title="Invalid order link"
            text="This link is missing the order number."
            tone="error"
          />
        )}
      </main>
    </>
  );
}

interface StatusPanelProps {
  title: string;
  text: string;
  tone: "info" | "error";
  onRetry?: () => void;
  retrying?: boolean;
}

function StatusPanel({ title, text, tone, onRetry, retrying = false }: StatusPanelProps) {
  const Icon = tone === "error" ? AlertCircleIcon : InfoCircleIcon;
  return (
    <section className={styles.status} role={tone === "error" ? "alert" : undefined}>
      <Icon className={styles.statusIcon} />
      <p className={styles.statusTitle}>{title}</p>
      <p className={styles.statusText}>{text}</p>
      {onRetry && (
        <SecondaryButton className={styles.statusButton} disabled={retrying} onClick={onRetry}>
          Try again
        </SecondaryButton>
      )}
    </section>
  );
}

function OrderKeys({ orderId }: { orderId: string }) {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("key");
  const keysQuery = useGetOrderKeys(orderId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loginDismissed, setLoginDismissed] = useState(false);

  if (keysQuery.isPending) {
    return (
      <div className={styles.loading}>
        <Spinner label="Loading your keys" />
      </div>
    );
  }

  if (keysQuery.isError) {
    const kind = readOrderKeysError(keysQuery.error);
    const copy = errorCopy[kind];
    return (
      <>
        <StatusPanel
          title={copy.title}
          text={kind === "unknown" ? readApiErrors(keysQuery.error)[0] : copy.text}
          tone={kind === "pending" || kind === "unauthorized" ? "info" : "error"}
          onRetry={copy.retry ? () => void keysQuery.refetch() : undefined}
          retrying={keysQuery.isFetching}
        />
        {kind === "unauthorized" &&
          !loginDismissed &&
          createPortal(
            <LoginRequiredModal
              message="To see your keys, you have to be logged-in."
              onClose={() => setLoginDismissed(true)}
            />,
            document.body,
          )}
      </>
    );
  }

  const keys = keysQuery.data.keys;
  if (keys.length === 0) {
    return (
      <StatusPanel
        title="No keys yet"
        text="This order doesn’t have any keys to show."
        tone="info"
      />
    );
  }

  const selected =
    keys.find((key) => key.id === selectedId) ??
    keys.find((key) => key.id === preselectedId) ??
    keys[0];

  return (
    <div className={styles.layout}>
      <ul className={styles.thumbs} aria-label="Products in this order">
        {keys.map((key) => {
          const active = key.id === selected.id;
          return (
            <li key={key.id}>
              <button
                type="button"
                className={[styles.thumb, active && styles.thumbActive].filter(Boolean).join(" ")}
                aria-pressed={active}
                aria-controls="selected-product-key"
                aria-label={key.product.title}
                onClick={() => setSelectedId(key.id)}
              >
                <img className={styles.thumbImage} src={key.product.imageUrl} alt="" />
              </button>
            </li>
          );
        })}
      </ul>
      <ProductKeyCard key={selected.id} id="selected-product-key" orderKey={selected} />
    </div>
  );
}
