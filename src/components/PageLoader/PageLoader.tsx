import { Spinner } from "../Spinner/Spinner";
import styles from "./PageLoader.module.css";

interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = "Loading..." }: PageLoaderProps) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <p className={styles.label}>{label}</p>
      <Spinner />
    </div>
  );
}
