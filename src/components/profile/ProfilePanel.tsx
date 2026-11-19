import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGetMe } from "../../api/useGetMe";
import { useLogout } from "../../api/useLogout";
import styles from "./ProfilePanel.module.css";

export interface ProfilePanelItem {
  label: string;
  icon: ReactNode;
  onSelect?: () => void;
  logout?: boolean;
}

interface ProfilePanelProps {
  items: ProfilePanelItem[];
  onClose: () => void;
  onLoggedOut: () => void;
  theme?: "dark" | "light";
  showIdentity?: boolean;
}

export function ProfilePanel({
  items,
  onClose,
  onLoggedOut,
  theme = "dark",
  showIdentity = true,
}: ProfilePanelProps) {
  const user = useGetMe(showIdentity);
  const logout = useLogout();
  const panelRef = useRef<HTMLDivElement>(null);
  const [logoutError, setLogoutError] = useState(false);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Element;
      if (panelRef.current?.contains(target)) return;
      if (target.closest("[data-profile-toggle]")) return;
      onClose();
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  const signOut = async () => {
    setLogoutError(false);
    try {
      await logout.mutateAsync();
      onLoggedOut();
    } catch {
      setLogoutError(true);
    }
  };

  return (
    <>
      <div className={styles.backdrop} aria-hidden="true" />
      <div
        className={theme === "light" ? `${styles.panel} ${styles.light}` : styles.panel}
        ref={panelRef}
        role="dialog"
        aria-label="Profile"
      >
        {showIdentity && (
          <>
            {user.isPending && <p className={styles.status}>Loading account…</p>}
            {user.error && <p className={styles.status}>Could not load your account.</p>}
            {user.data && (
              <div className={styles.identity}>
                <span className={styles.avatar}>
                  <img src="/profile.svg" alt="" />
                </span>
                <span className={styles.details}>
                  <span className={styles.name}>{user.data.name}</span>
                  <span className={styles.email}>{user.data.email}</span>
                </span>
              </div>
            )}
            <div className={styles.divider} />
          </>
        )}
        <ul className={styles.menu}>
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={styles.item}
                disabled={item.logout ? logout.isPending : undefined}
                onClick={item.logout ? signOut : item.onSelect}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        {logoutError && <p className={styles.status}>Could not log out.</p>}
      </div>
    </>
  );
}
