import { Link } from "react-router-dom";
import { CartIcon } from "../../icons/CartIcon";
import { SearchBar } from "../search/SearchBar/SearchBar";
import { ROUTES } from "../../routes/paths";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link className={styles.logoLink} to={ROUTES.store} aria-label="Eneba">
        <img
          className={styles.logo}
          src="https://static.eneba.games/branding/v2/logoFull.svg"
          alt="Eneba"
        />
      </Link>
      <SearchBar />
      <div className={styles.actions}>
        <button type="button" className={styles.cart} aria-label="My shopping cart">
          <CartIcon />
        </button>
        <button type="button" className={styles.profile} aria-label="Profile">
          <img src="/profile.svg" alt="" />
        </button>
      </div>
    </header>
  );
}
