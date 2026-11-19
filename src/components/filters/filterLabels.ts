import type { ProductType } from "../../constants/productType";
import type { Region } from "../../constants/region";
import type { FilterOption } from "../../types/productFilters";

export type FilterGroup = "type" | "platform" | "region" | "genre";

const typeLabels: Record<ProductType, string> = {
  game: "Game",
  dlc: "DLC",
  gift_card: "Gift card",
  subscription: "Subscription",
  software: "Software",
  top_up: "Top up",
};

const regionLabels: Record<Region, string> = {
  global: "Global",
  europe: "Europe",
  north_america: "North America",
  uk: "UK",
  latam: "LatAm",
  asia: "Asia",
};

export const optionLabel = (
  group: FilterGroup,
  option: FilterOption & { label?: string },
) => {
  if (group === "genre" || group === "platform") return option.label ?? option.value;
  if (group === "type") return typeLabels[option.value as ProductType] ?? option.value;
  return regionLabels[option.value as Region] ?? option.value;
};
