import { ConfusedGhostIcon } from "../../icons/ConfusedGhostIcon";
import { PrimaryButton } from "../buttons/PrimaryButton";
import styles from "./NoMatches.module.css";

interface NoMatchesProps {
  onViewPopular: () => void;
}

export function NoMatches({ onViewPopular }: NoMatchesProps) {
  return (
    <div className={styles.noMatches}>
      <ConfusedGhostIcon className={styles.ghost} />
      <p className={styles.title}>Sorry, no matches found</p>
      <p className={styles.text}>
        Please check your spelling, try different keywords, or browse our product catalog.
      </p>
      <PrimaryButton className={styles.popular} onClick={onViewPopular}>
        View popular products
      </PrimaryButton>
    </div>
  );
}
