import { useEffect, useRef, useState } from "react";
import { useGetMe } from "../../api/useGetMe";
import { useLogout } from "../../api/useLogout";
import { CartSuccessIcon } from "../../icons/CartSuccessIcon";
import { GamePadIcon } from "../../icons/GamePadIcon";
import { LogOutIcon } from "../../icons/LogOutIcon";
import styles from "./ProfilePanel.module.css";

interface ProfilePanelProps {
  onClose: () => void;
  onLoggedOut: () => void;
}

export function ProfilePanel({ onClose, onLoggedOut }: ProfilePanelProps) {
  const user = useGetMe(true);
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
      <div className={styles.panel} ref={panelRef} role="dialog" aria-label="Profile">
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
        <ul className={styles.menu}>
          <li>
            <button type="button" className={styles.item}>
              <CartSuccessIcon width={20} height={20} />
              Orders
            </button>
          </li>
          <li>
            <button type="button" className={styles.item}>
              <GamePadIcon width={20} height={20} />
              Keys library
            </button>
          </li>
          <li>
            <button type="button" className={styles.item} disabled={logout.isPending} onClick={signOut}>
              <LogOutIcon width={20} height={20} />
              Logout
            </button>
          </li>
        </ul>
        {logoutError && <p className={styles.status}>Could not log out.</p>}
      </div>
    </>
  );
}
