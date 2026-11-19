import type {
  FilterGroup,
  FilterGroupConfig,
  ProductFiltersResponse,
  StoreFilterValue,
} from "../../../types/productFilters";

export const emptyStoreFilters: StoreFilterValue = {
  minPrice: "",
  maxPrice: "",
  types: [],
  platforms: [],
  regions: [],
  genres: [],
};

export const filterGroups: FilterGroupConfig[] = [
  { id: "types", title: "Product type", group: "type" },
  { id: "platforms", title: "Platforms", group: "platform" },
  { id: "genres", title: "Genres", group: "genre" },
  { id: "regions", title: "Regions", group: "region" },
];

export const priceSelectionCount = (value: StoreFilterValue) =>
  Number(value.minPrice.trim() !== "") + Number(value.maxPrice.trim() !== "");

export function groupOptions(filters: ProductFiltersResponse | undefined, group: FilterGroup) {
  if (!filters) return [];
  if (group === "type") return filters.types;
  if (group === "platform") return filters.platforms;
  if (group === "genre") return filters.genres;
  return filters.regions;
}
