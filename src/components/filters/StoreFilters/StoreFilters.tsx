import type { ProductFiltersResponse, StoreFilterValue } from "../../../types/productFilters";
import { FilterInput } from "../FilterInput/FilterInput";
import { FilterOptionList } from "../FilterOptionList/FilterOptionList";
import { FilterSection } from "../FilterSection/FilterSection";
import { filterGroups, groupOptions, priceSelectionCount } from "./storeFilterOptions";
import styles from "./StoreFilters.module.css";

interface StoreFiltersProps {
  filters: ProductFiltersResponse | undefined;
  value: StoreFilterValue;
  onChange: (value: StoreFilterValue) => void;
}

const pricePattern = /^(\d+(\.\d{0,2})?)?$/;

export function PriceFields({
  value,
  onChange,
}: {
  value: StoreFilterValue;
  onChange: (value: StoreFilterValue) => void;
}) {
  return (
    <div className={styles.priceRow}>
      <FilterInput
        label="Minimum price"
        inputMode="decimal"
        value={value.minPrice}
        onChange={(minPrice) => {
          if (pricePattern.test(minPrice)) onChange({ ...value, minPrice });
        }}
      />
      <span className={styles.dash} aria-hidden="true">
        –
      </span>
      <FilterInput
        label="Maximum price"
        inputMode="decimal"
        value={value.maxPrice}
        onChange={(maxPrice) => {
          if (pricePattern.test(maxPrice)) onChange({ ...value, maxPrice });
        }}
      />
    </div>
  );
}

export function StoreFilters({ filters, value, onChange }: StoreFiltersProps) {
  return (
    <aside className={styles.filters}>
      <FilterSection
        title="Price range (EUR)"
        selectedCount={priceSelectionCount(value)}
      >
        <PriceFields value={value} onChange={onChange} />
      </FilterSection>
      {filterGroups.map((item) => (
        <FilterSection
          key={item.id}
          title={item.title}
          selectedCount={value[item.id].length}
        >
          <FilterOptionList
            title={item.title}
            group={item.group}
            options={groupOptions(filters, item.group)}
            selected={value[item.id]}
            onChange={(selected) => onChange({ ...value, [item.id]: selected })}
          />
        </FilterSection>
      ))}
    </aside>
  );
}
