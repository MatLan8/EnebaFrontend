import type { SVGProps } from "react";

export function PendingCircleOutlineIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12 .25a11.75 11.75 0 1 0 0 23.5 11.75 11.75 0 0 0 0-23.5Zm-7.25 4.5a10.25 10.25 0 1 1 14.5 14.5 10.25 10.25 0 0 1-14.5-14.5ZM12 6.25a.75.75 0 0 1 .75.75v4.69l2.78 2.78a.75.75 0 1 1-1.06 1.06l-3-3A.75.75 0 0 1 11.25 12V7a.75.75 0 0 1 .75-.75Z"
      />
    </svg>
  );
}
