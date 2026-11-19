import type { ComponentType, SVGProps } from "react";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { CartSuccessIcon } from "../../../icons/CartSuccessIcon";
import { GamePadIcon } from "../../../icons/GamePadIcon";
import { ROUTES } from "../../../routes/paths";
import styles from "./AccountNav.module.css";

interface AccountNavItem {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  activePaths?: string[];
}

const navItems: AccountNavItem[] = [
  { to: ROUTES.orders, label: "Orders", Icon: CartSuccessIcon, activePaths: [ROUTES.orderDetails] },
  { to: ROUTES.keysLibrary, label: "Keys library", Icon: GamePadIcon },
];

export function AccountNav() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="Account">
      <ul className={styles.list}>
        {navItems.map(({ to, label, Icon, activePaths = [] }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive || activePaths.some((path) => matchPath(path, pathname))
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              <Icon width={20} height={20} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
