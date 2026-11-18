interface IconProps {
  className?: string;
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5L6.5 6.5L11.5 1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
