import type { SVGProps } from "react";

export function XCircleOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={35}
      height={35}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 .25a11.75 11.75 0 1 0 0 23.5 11.75 11.75 0 0 0 0-23.5Zm-7.25 4.5a10.25 10.25 0 1 1 14.5 14.5 10.25 10.25 0 0 1-14.5-14.5Zm3.47 2.72a.75.75 0 0 0-1.06 1.06L10.94 12l-3.78 3.78a.75.75 0 1 0 1.06 1.06L12 13.06l3.78 3.78a.75.75 0 1 0 1.06-1.06L13.06 12l3.78-3.78a.75.75 0 0 0-1.06-1.06L12 10.94 8.22 7.47Z"
      />
    </svg>
  );
}
