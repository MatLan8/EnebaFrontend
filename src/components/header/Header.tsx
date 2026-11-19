import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCart } from "../../api/useGetCart";
import { readLoggedIn } from "../../auth/session";
import { CartIcon } from "../../icons/CartIcon";
import { CartPanel } from "../cart/CartPanel";
import { ProfilePanel } from "../profile/ProfilePanel";
import { SearchBar } from "../search/SearchBar/SearchBar";
import { ROUTES } from "../../routes/paths";
import styles from "./Header.module.css";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(readLoggedIn);
  const itemCount = useGetCart(true).data?.itemCount ?? 0;

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
        <div className={cartOpen ? `${styles.cartWrap} ${styles.cartOpen}` : styles.cartWrap}>
          <button
            type="button"
            className={styles.cart}
            aria-label={itemCount > 0 ? `My shopping cart, ${itemCount} items` : "My shopping cart"}
            aria-expanded={cartOpen}
            data-cart-toggle
            onClick={() => {
              setCartOpen((open) => !open);
              setProfileOpen(false);
            }}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {itemCount}
              </span>
            )}
          </button>
          {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
        </div>
        {loggedIn ? (
          <div className={profileOpen ? `${styles.profileWrap} ${styles.profileOpen}` : styles.profileWrap}>
            <button
              type="button"
              className={styles.profile}
              aria-label="Profile"
              aria-expanded={profileOpen}
              data-profile-toggle
              onClick={() => {
                setProfileOpen((open) => !open);
                setCartOpen(false);
              }}
            >
              <img src="/profile.svg" alt="" />
            </button>
            {profileOpen && (
              <ProfilePanel
                onClose={() => setProfileOpen(false)}
                onLoggedOut={() => {
                  setLoggedIn(false);
                  setProfileOpen(false);
                }}
              />
            )}
          </div>
        ) : (
          <nav className={styles.account} aria-label="Account">
            <Link to={ROUTES.login}>Log in</Link>
            <span aria-hidden="true">|</span>
            <Link to={ROUTES.register}>Register</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
