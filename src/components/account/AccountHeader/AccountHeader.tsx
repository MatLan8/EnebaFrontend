import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetMe } from "../../../api/useGetMe";
import { EnebaIcon } from "../../../icons/EnebaIcon";
import { LogOutIcon } from "../../../icons/LogOutIcon";
import { ROUTES } from "../../../routes/paths";
import { ProfilePanel, type ProfilePanelItem } from "../../profile/ProfilePanel";
import styles from "./AccountHeader.module.css";

export function AccountHeader() {
  const navigate = useNavigate();
  const user = useGetMe(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const items: ProfilePanelItem[] = [
    {
      label: "Back to store",
      icon: <EnebaIcon width={20} height={20} />,
      onSelect: () => navigate(ROUTES.homepage),
    },
    { label: "Logout", icon: <LogOutIcon width={20} height={20} />, logout: true },
  ];

  return (
    <header className={styles.header}>
      <Link className={styles.logoLink} to={ROUTES.homepage} aria-label="Eneba">
        <img
          className={styles.logo}
          src="https://static.eneba.games/branding/v2/logoFull.svg"
          alt="Eneba"
        />
      </Link>
      <div className={styles.actions}>
        {user.data && <span className={styles.email}>{user.data.email}</span>}
        <div className={profileOpen ? `${styles.profileWrap} ${styles.profileOpen}` : styles.profileWrap}>
          <button
            type="button"
            className={styles.profile}
            aria-label="Profile"
            aria-expanded={profileOpen}
            data-profile-toggle
            onClick={() => setProfileOpen((open) => !open)}
          >
            <img src="/profile.svg" alt="" />
          </button>
          {profileOpen && (
            <ProfilePanel
              theme="light"
              items={items}
              onClose={() => setProfileOpen(false)}
              onLoggedOut={() => {
                setProfileOpen(false);
                navigate(ROUTES.homepage);
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
