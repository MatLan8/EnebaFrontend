import type { SVGProps } from "react";

export function PcMagBadgeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 150 40" aria-label="PC Mag Editor's Choice" role="img" {...props}>
      <path fill="#E10600" d="M0 0h128l22 20-22 20H0V0Z" />
      <text x="12" y="17" fill="#fff" fontSize="13" fontWeight="800">
        PC
      </text>
      <text x="8" y="32" fill="#fff" fontSize="13" fontWeight="800">
        MAG
      </text>
      <text x="48" y="17" fill="#fff" fontSize="9" fontWeight="800">
        EDITOR&apos;S
      </text>
      <text x="52" y="32" fill="#fff" fontSize="9" fontWeight="800">
        CHOICE
      </text>
    </svg>
  );
}
