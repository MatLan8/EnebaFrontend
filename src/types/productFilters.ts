export interface FilterOption {
  value: string;
  count: number;
}

export interface GenreFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface ProductFiltersResponse {
  types: FilterOption[];
  platforms: FilterOption[];
  regions: FilterOption[];
  genres: GenreFilterOption[];
}
