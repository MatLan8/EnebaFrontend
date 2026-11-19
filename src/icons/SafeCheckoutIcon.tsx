import type { SVGProps } from "react";

export function SafeCheckoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" {...props}>
      <circle cx="15" cy="18" r="12" fill="none" stroke="#9FEE49" strokeWidth="1.6" />
      <ellipse cx="15" cy="18" rx="5.5" ry="12" fill="none" stroke="#9FEE49" strokeWidth="1.4" />
      <path d="M3 18h24M4.5 12.5h21M4.5 23.5h21" fill="none" stroke="#9FEE49" strokeWidth="1.3" />
      <path
        fill="#9FEE49"
        d="M28.2 20.2 22.6 18.4a.7.7 0 0 0-.4 0l-5.6 1.8c-.2.1-.3.2-.3.4v4.2a8.4 8.4 0 0 0 6.1 8.1 8.4 8.4 0 0 0 6.1-8.1v-4.2c0-.2-.1-.3-.3-.4Zm-3 4.6-2.9 2.6a.7.7 0 0 1-.9-.1l-1.2-1.4a.7.7 0 1 1 1-.9l.7.9 2.4-2.2a.7.7 0 0 1 .9 1.1Z"
      />
    </svg>
  );
}
