interface SortIconProps {
  className?: string;
  ascending?: boolean;
}

const bars =
  "M240 96h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm-16 112v-32a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H240a16 16 0 0 1-16-16zm0 256v-32a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-64a16 16 0 0 1-16-16zm0-128v-32a16 16 0 0 1 16-16h128a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H240a16 16 0 0 1-16-16z";

const arrowDown =
  "M187.3 395.31l-79.99 80a16 16 0 0 1-22.62 0l-79.98-80C-5.37 385.24 1.8 368 16 368H64V48a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16v320h47.98c14.25 0 21.37 17.26 11.32 27.31z";

const arrowUp =
  "M4.7 116.69l79.99-80a16 16 0 0 1 22.62 0l79.98 80c10.07 10.07 2.9 27.31-11.31 27.31H128v320a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V144H16.02C1.77 144-5.35 126.74 4.7 116.69z";

export function SortIcon({ className, ascending = false }: SortIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 512 512"
      aria-hidden="true"
    >
      <path fill="currentColor" d={`${ascending ? arrowUp : arrowDown}${bars}`} />
    </svg>
  );
}
