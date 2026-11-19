import styles from "./CheckoutFooter.module.css";

export function CheckoutFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Shopping on Eneba is risk-free &amp; easy!</h2>
        <p className={styles.text}>
          If you may experience any inconvenience, our Support Team is happy to help.{" "}
          <button type="button" className={styles.ticket}>
            Create a ticket
          </button>{" "}
          and we&apos;ll contact you as soon as possible.
        </p>
        <hr className={styles.divider} />
        <p className={styles.copyright}>
          Copyright © 2026 Eneba. All Rights Reserved. JSC “Helis play”, Gyneju St. 4-333,
          Vilnius, the Republic of Lithuania{" "}
          <button type="button" className={styles.link}>
            Terms and Conditions
          </button>
          ,{" "}
          <button type="button" className={styles.link}>
            Privacy notice
          </button>
          ,{" "}
          <button type="button" className={styles.link}>
            Cookie preferences
          </button>
          .
        </p>
      </div>
    </footer>
  );
}
