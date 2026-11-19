import { Link } from "react-router-dom";
import { CheckCircleOutlineIcon } from "../../../icons/CheckCircleOutlineIcon";
import { ROUTES } from "../../../routes/paths";
import styles from "./CheckoutHeader.module.css";

const steps = ["Cart", "Payment", "Get your product"];

interface CheckoutHeaderProps {
  activeStep: number;
}

export function CheckoutHeader({ activeStep }: CheckoutHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logoLink} to={ROUTES.store} aria-label="Eneba">
          <img
            className={styles.logo}
            src="https://static.eneba.games/branding/v2/logoFull.svg"
            alt="Eneba"
          />
        </Link>
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
