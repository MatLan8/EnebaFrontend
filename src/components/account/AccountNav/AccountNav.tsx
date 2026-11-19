import type { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router-dom";
import { CartSuccessIcon } from "../../../icons/CartSuccessIcon";
import { GamePadIcon } from "../../../icons/GamePadIcon";
import { ROUTES } from "../../../routes/paths";
import styles from "./AccountNav.module.css";

interface AccountNavItem {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const navItems: AccountNavItem[] = [
  { to: ROUTES.orders, label: "Orders", Icon: CartSuccessIcon },
  { to: ROUTES.keysLibrary, label: "Keys library", Icon: GamePadIcon },
];

export function AccountNav() {
  return (
    <nav className={styles.nav} aria-label="Account">
      <ul className={styles.list}>
        {navItems.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
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
