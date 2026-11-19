import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetCart } from "../../../api/cart/useGetCart";
import { readLoggedIn } from "../../../auth/session";
import { CartIcon } from "../../../icons/CartIcon";
import { CartSuccessIcon } from "../../../icons/CartSuccessIcon";
import { GamePadIcon } from "../../../icons/GamePadIcon";
import { LogOutIcon } from "../../../icons/LogOutIcon";
import { CartPanel } from "../../cart/CartPanel/CartPanel";
import { ProfilePanel, type ProfilePanelItem } from "../../profile/ProfilePanel/ProfilePanel";
import { SearchBar } from "../../search/SearchBar/SearchBar";
import { ROUTES } from "../../../routes/paths";
import { CategoryBar } from "../CategoryBar/CategoryBar";
import { BrandLogo } from "../../BrandLogo/BrandLogo";
import styles from "./Header.module.css";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(readLoggedIn);
  const itemCount = useGetCart(true).data?.itemCount ?? 0;
  const navigate = useNavigate();

  const openPage = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  const profileItems: ProfilePanelItem[] = [
    {
      label: "Orders",
      icon: <CartSuccessIcon width={20} height={20} />,
      onSelect: () => openPage(ROUTES.orders),
    },
    {
      label: "Keys library",
      icon: <GamePadIcon width={20} height={20} />,
      onSelect: () => openPage(ROUTES.keysLibrary),
    },
    { label: "Logout", icon: <LogOutIcon width={20} height={20} />, logout: true },
  ];

  return (
    <>
      <header className={styles.header}>
        <BrandLogo className={styles.logo} linkClassName={styles.logoLink} />
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
                  items={profileItems}
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
      <CategoryBar />
    </>
  );
}
