import { PcMagBadgeIcon } from "../../../icons/PcMagBadgeIcon";
import { SafeCheckoutIcon } from "../../../icons/SafeCheckoutIcon";
import { ScamAdviserLogoIcon } from "../../../icons/ScamAdviserLogoIcon";
import styles from "./SafeCheckout.module.css";

export function SafeCheckout() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Safe Checkout Guaranteed</h2>
      <p className={styles.encryption}>Data Encryption &amp; Protection</p>
      <ScamAdviserLogoIcon className={styles.scam} />
      <p className={styles.score}>Trust score 100/100</p>
      <div className={styles.badges}>
        <div className={styles.guarantee}>
          <SafeCheckoutIcon className={styles.mark} />
          <p>
            Safe checkout
            <br />
            guaranteed
          </p>
        </div>
        <PcMagBadgeIcon className={styles.pcmag} />
      </div>
    </section>
  );
}
