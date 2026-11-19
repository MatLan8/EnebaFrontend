import { useEffect, useRef, useState } from "react";
import type { ProductFiltersResponse, StoreFilterValue } from "../../../types/productFilters";
import { ChevronIcon } from "../../../icons/ChevronIcon";
import { FilterOptionList } from "../FilterOptionList/FilterOptionList";
import { PriceFields } from "../StoreFilters/StoreFilters";
import { filterGroups, groupOptions, priceSelectionCount } from "../StoreFilters/storeFilterOptions";
import styles from "./FilterPills.module.css";

interface FilterPillsProps {
  filters: ProductFiltersResponse | undefined;
  value: StoreFilterValue;
  onChange: (value: StoreFilterValue) => void;
  searchText: string;
  onClearSearchText: () => void;
}

export function FilterPills({
  filters,
  value,
  onChange,
  searchText,
  onClearSearchText,
}: FilterPillsProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const priceCount = priceSelectionCount(value);
  const activeGroups = filterGroups.filter((item) => value[item.id].length > 0);
  const hasPrice = priceCount > 0;
  const hasSelection = hasPrice || activeGroups.length > 0 || searchText.length > 0;

  useEffect(() => {
    if (!openId) return;

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenId(null);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openId]);

  if (!hasSelection) return null;

  const clearAll = () => {
    onChange({
      ...value,
      minPrice: "",
      maxPrice: "",
      types: [],
      platforms: [],
      regions: [],
      genres: [],
    });
    if (searchText) onClearSearchText();
  };

  return (
    <div className={styles.row} ref={rootRef}>
      <div className={styles.pills}>
        {searchText && (
          <div className={`${styles.pill} ${styles.textPill}`}>
            <span>
              <span className={styles.textLabel}>Text:</span> {searchText}
            </span>
            <button
              type="button"
              className={styles.remove}
              aria-label="Remove text filter"
              onClick={onClearSearchText}
            >
              ×
            </button>
          </div>
        )}
        {hasPrice && (
          <div className={styles.pillWrap}>
            <button
              type="button"
              className={styles.pill}
              aria-expanded={openId === "price"}
              onClick={() => setOpenId((current) => (current === "price" ? null : "price"))}
            >
              Price ({priceCount})
              <ChevronIcon className={openId === "price" ? styles.chevronOpen : styles.chevron} />
            </button>
            {openId === "price" && (
              <div className={styles.menu}>
                <PriceFields value={value} onChange={onChange} />
                <button
                  type="button"
                  className={styles.clear}
                  onClick={() => onChange({ ...value, minPrice: "", maxPrice: "" })}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
        {activeGroups.map((item) => {
          const open = openId === item.id;
          return (
            <div className={styles.pillWrap} key={item.id}>
              <button
                type="button"
                className={styles.pill}
                aria-expanded={open}
                onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
              >
                {item.title} ({value[item.id].length})
                <ChevronIcon className={open ? styles.chevronOpen : styles.chevron} />
              </button>
              {open && (
                <div className={styles.menu}>
                  <FilterOptionList
                    title={item.title}
                    group={item.group}
                    options={groupOptions(filters, item.group)}
                    selected={value[item.id]}
                    onChange={(selected) => onChange({ ...value, [item.id]: selected })}
                    onClear={() => onChange({ ...value, [item.id]: [] })}
                  />
                </div>
              )}
            </div>
          );
        })}
        <button type="button" className={styles.clearAll} onClick={clearAll}>
          Clear all
        </button>
      </div>
    </div>
  );
}
