import type { SVGProps } from "react";

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={15}
      height={14}
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 4.26c0-.17-.13-.27-.4-.32l-3.62-.5L6.35.28C6.26.09 6.15 0 6 0c-.14 0-.26.1-.35.28L4.02 3.44l-3.62.5c-.27.05-.4.15-.4.32 0 .1.06.21.18.34l2.63 2.45-.62 3.46-.02.14c0 .1.03.18.08.25s.12.1.22.1c.09 0 .19-.03.3-.08L6 9.28l3.24 1.64c.1.05.2.08.29.08.1 0 .17-.03.22-.1a.4.4 0 0 0 .07-.25 1 1 0 0 0 0-.14l-.63-3.46 2.62-2.45c.13-.12.19-.24.19-.34z"
      />
    </svg>
  );
}
