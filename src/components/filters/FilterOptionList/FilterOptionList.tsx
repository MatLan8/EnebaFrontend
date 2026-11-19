import { useState } from "react";
import type { FilterOption } from "../../../types/productFilters";
import { FilterCheckbox } from "../FilterCheckbox/FilterCheckbox";
import { FilterInput } from "../FilterInput/FilterInput";
import type { FilterGroup } from "../../../types/productFilters";
import { optionLabel } from "../filterLabels";
import styles from "./FilterOptionList.module.css";

interface FilterOptionListProps {
  title: string;
  group: FilterGroup;
  options: Array<FilterOption & { label?: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  onClear?: () => void;
}

const toggle = (selected: string[], value: string, checked: boolean) =>
  checked ? [...selected, value] : selected.filter((item) => item !== value);

export function FilterOptionList({
  title,
  group,
  options,
  selected,
  onChange,
  onClear,
}: FilterOptionListProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visible = options.filter((option) =>
    optionLabel(group, option).toLowerCase().includes(query),
  );

  return (
    <div>
      <div className={styles.search}>
        <FilterInput
          icon
          label={`Search ${title.toLowerCase()}`}
          value={search}
          onChange={setSearch}
        />
      </div>
      <ul className={styles.options}>
        {visible.map((option) => (
          <li key={option.value}>
            <FilterCheckbox
              label={optionLabel(group, option)}
              count={option.count}
              checked={selected.includes(option.value)}
              onChange={(checked) => onChange(toggle(selected, option.value, checked))}
            />
          </li>
        ))}
      </ul>
      {onClear && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear all
        </button>
      )}
    </div>
  );
}
