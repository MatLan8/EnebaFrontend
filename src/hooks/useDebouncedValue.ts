import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T | null, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (value === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}
