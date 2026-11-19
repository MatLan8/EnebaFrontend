import type { SVGProps } from "react";

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx={12} cy={12} r={9.25} stroke="currentColor" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.75 12h18.5M12 2.75c2.4 2.5 3.75 5.8 3.75 9.25s-1.35 6.75-3.75 9.25M12 2.75C9.6 5.25 8.25 8.55 8.25 12s1.35 6.75 3.75 9.25"
      />
    </svg>
  );
}
