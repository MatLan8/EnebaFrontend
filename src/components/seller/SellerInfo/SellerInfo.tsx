import { StarIcon } from "../../../icons/StartIcon";
import { VerifiedSealIcon } from "../../../icons/VerificationIcon";
import { sellerRatingLabel } from "../../../utils/sellerRating";
import styles from "./SellerInfo.module.css";

export interface SellerSummary {
  name: string;
  logoUrl: string | null;
  rating: number;
}

interface SellerInfoProps {
  seller: SellerSummary;
  nameStyle?: "bold" | "caps";
  className?: string;
}

export function SellerInfo({ seller, nameStyle = "bold", className }: SellerInfoProps) {
  return (
    <div className={[styles.seller, className].filter(Boolean).join(" ")}>
      {seller.logoUrl ? (
        <img className={styles.logo} src={seller.logoUrl} alt="" />
      ) : (
        <span className={styles.logoFallback} aria-hidden="true">
          {seller.name.slice(0, 1)}
        </span>
      )}
      <div className={styles.identity}>
        <p className={[styles.nameRow, nameStyle === "caps" && styles.nameCaps].filter(Boolean).join(" ")}>
          <span className={styles.name}>{seller.name}</span>
          <VerifiedSealIcon />
        </p>
        <p className={styles.rating}>
          <StarIcon />
          <span className={styles.ratingMain}>
            {seller.rating.toFixed(2)} {sellerRatingLabel(seller.rating)}
          </span>
          <span className={styles.ratingWord}>rating</span>
        </p>
      </div>
    </div>
  );
}
