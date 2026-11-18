import type { ProductFiltersResponse } from "../../../types/productFilters";
import { FilterInput } from "../FilterInput/FilterInput";
import { FilterOptionList } from "../FilterOptionList/FilterOptionList";
import { FilterSection } from "../FilterSection/FilterSection";
import type { FilterGroup } from "../filterLabels";
import styles from "./StoreFilters.module.css";

export interface StoreFilterValue {
  minPrice: string;
  maxPrice: string;
  types: string[];
  platforms: string[];
  regions: string[];
  genres: string[];
}

export const emptyStoreFilters: StoreFilterValue = {
  minPrice: "",
  maxPrice: "",
  types: [],
  platforms: [],
  regions: [],
  genres: [],
};

export interface FilterGroupConfig {
  id: "types" | "platforms" | "genres" | "regions";
  title: string;
  group: FilterGroup;
}

export const filterGroups: FilterGroupConfig[] = [
  { id: "types", title: "Product type", group: "type" },
  { id: "platforms", title: "Platforms", group: "platform" },
  { id: "genres", title: "Genres", group: "genre" },
  { id: "regions", title: "Regions", group: "region" },
];

export const priceSelectionCount = (value: StoreFilterValue) =>
  Number(value.minPrice.trim() !== "") + Number(value.maxPrice.trim() !== "");

interface StoreFiltersProps {
  filters: ProductFiltersResponse | undefined;
  value: StoreFilterValue;
  onChange: (value: StoreFilterValue) => void;
}

export function groupOptions(
  filters: ProductFiltersResponse | undefined,
  group: FilterGroup,
) {
  if (!filters) return [];
  if (group === "type") return filters.types;
  if (group === "platform") return filters.platforms;
  if (group === "genre") return filters.genres;
  return filters.regions;
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
