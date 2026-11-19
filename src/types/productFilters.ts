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

export type FilterGroup = "type" | "platform" | "region" | "genre";

export interface FilterGroupConfig {
  id: "types" | "platforms" | "genres" | "regions";
  title: string;
  group: FilterGroup;
}

export interface StoreFilterValue {
  minPrice: string;
  maxPrice: string;
  types: string[];
  platforms: string[];
  regions: string[];
  genres: string[];
}