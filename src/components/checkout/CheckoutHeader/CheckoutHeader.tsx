import { CheckCircleOutlineIcon } from "../../../icons/CheckCircleOutlineIcon";
import { BrandLogo } from "../../BrandLogo/BrandLogo";
import styles from "./CheckoutHeader.module.css";

const steps = ["Cart", "Payment", "Get your product"];

interface CheckoutHeaderProps {
  activeStep: number;
}

export function CheckoutHeader({ activeStep }: CheckoutHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <BrandLogo className={styles.logo} linkClassName={styles.logoLink} />
        <ol className={styles.steps}>
          {steps.map((step, index) => {
            const number = index + 1;
            const active = number === activeStep;
            const completed = number < activeStep;
            const className = [
              styles.step,
              active && styles.active,
              completed && styles.completed,
              number > activeStep + 1 && styles.later,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <li
                key={step}
                className={className}
                aria-current={active ? "step" : undefined}
              >
                {completed ? (
                  <CheckCircleOutlineIcon className={styles.checkIcon} />
                ) : (
                  <span className={styles.circle}>{number}</span>
                )}
                <span className={styles.label}>{step}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
