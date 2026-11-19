import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

interface BrandLogoProps {
  className: string;
  linkClassName: string;
}

export function BrandLogo({ className, linkClassName }: BrandLogoProps) {
  return (
    <Link className={linkClassName} to={ROUTES.homepage} aria-label="Eneba">
      <img
        className={className}
        src="https://static.eneba.games/branding/v2/logoFull.svg"
        alt="Eneba"
      />
    </Link>
  );
}
