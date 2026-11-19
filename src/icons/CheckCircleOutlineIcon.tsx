import type { SVGProps } from "react";

export function CheckCircleOutlineIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12 .25a11.75 11.75 0 1 0 0 23.5 11.75 11.75 0 0 0 0-23.5Zm-7.25 4.5a10.25 10.25 0 1 1 14.5 14.5 10.25 10.25 0 0 1-14.5-14.5Zm13.7 2.66a.75.75 0 0 0-1.17-.93l-7.67 9.7v.01a.28.28 0 0 1-.46-.01v-.02l-2.4-3.4a.75.75 0 0 0-1.23.87l2.4 3.4a1.78 1.78 0 0 0 2.87.08l7.67-9.7Z"
      />
    </svg>
  );
}
