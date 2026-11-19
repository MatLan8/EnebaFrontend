import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { regionNames } from "../../../constants/region";
import { CopyIcon } from "../../../icons/CopyIcon";
import { GlobeVerifiedIcon } from "../../../icons/GlobeVerifiedIcon";
import { KeyIcon } from "../../../icons/KeyIcon";
import { ROUTES } from "../../../routes/paths";
import type { OrderKey } from "../../../types/orderKeys";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SellerInfo } from "../../seller/SellerInfo/SellerInfo";
import styles from "./ProductKeyCard.module.css";

type CopyState = "idle" | "copied" | "failed";

const copyFeedbackMs = 2000;

interface KeyFactProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function KeyFact({ icon, label, value }: KeyFactProps) {
  return (
    <div className={styles.fact}>
      <span className={styles.factIcon}>{icon}</span>
      <div className={styles.factText}>
        <p className={styles.factLabel}>{label}</p>
        <p className={styles.factValue}>{value}</p>
      </div>
    </div>
  );
}

interface ProductKeyCardProps {
  orderKey: OrderKey;
  id?: string;
}

export function ProductKeyCard({ orderKey, id }: ProductKeyCardProps) {
  const navigate = useNavigate();
  const { product, seller, code } = orderKey;
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), copyFeedbackMs);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const copyLabel =
    copyState === "copied" ? "Key copied" : copyState === "failed" ? "Could not copy the key" : "Copy key";

  return (
    <article id={id} className={styles.card} aria-label={product.title}>
      <h2 className={styles.title}>{product.title}</h2>

      <div className={styles.facts}>
        <KeyFact
          icon={<GlobeVerifiedIcon />}
          label="Region"
          value={regionNames[product.region] ?? product.region}
        />
        <KeyFact
          icon={<img className={styles.platformIcon} src={product.platform.iconUrl} alt="" />}
          label="Platform"
          value={product.platform.name}
        />
        <KeyFact icon={<KeyIcon className={styles.keyIcon} />} label="Product type" value="Digital key" />
      </div>

      <p className={styles.codeLabel}>Digital product key:</p>
      <div className={styles.codeBox}>
        <div className={styles.codeArea}>
        <div className={styles.codeRow}>
          <span className={styles.code}>{code}</span>
          <button
            type="button"
            className={[styles.copyButton, copyState === "copied" && styles.copied].filter(Boolean).join(" ")}
            aria-label={copyLabel}
            title={copyLabel}
            onClick={copyCode}
          >
            <CopyIcon className={styles.copyIcon} />
          </button>
        </div>
        <p className={styles.copyStatus} role="status" aria-live="polite">
          {copyState === "copied" ? "Copied" : copyState === "failed" ? "Could not copy" : ""}
        </p>
        </div>
        <div className={styles.libraryRow}>
          <p className={styles.libraryText}>
            Don’t want to use it now? Don’t worry. You can always find the code in your Library!
          </p>
          <SecondaryButton className={styles.libraryButton} onClick={() => navigate(ROUTES.keysLibrary)}>
            My library
          </SecondaryButton>
        </div>
      </div>

      <p className={styles.refund}>
        Since it’s a digital product and the key was displayed, you are not eligible for a refund unless the
        key is invalid or faulty.
      </p>

      <SellerInfo className={styles.seller} seller={seller} nameStyle="caps" />
    </article>
  );
}
