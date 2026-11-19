export interface FilterOption {
  value: string;
  count: number;
}

export interface LabeledFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface ProductFiltersResponse {
  types: FilterOption[];
  platforms: LabeledFilterOption[];
  regions: FilterOption[];
  genres: LabeledFilterOption[];
}
