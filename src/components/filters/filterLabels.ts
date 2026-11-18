import type { Platform } from "../../constants/platform";
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

const platformLabels: Record<Platform, string> = {
  steam: "Steam",
  xbox_live: "Xbox Live",
  psn: "PSN",
  nintendo_eshop: "Nintendo",
  ea_app: "EA App",
  ubisoft: "Ubisoft",
  epic_games: "Epic Games",
  battlenet: "Battle.net",
  official_website: "Official website",
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
  if (group === "genre") return option.label ?? option.value;
  if (group === "type") return typeLabels[option.value as ProductType] ?? option.value;
  if (group === "platform") return platformLabels[option.value as Platform] ?? option.value;
  return regionLabels[option.value as Region] ?? option.value;
};
