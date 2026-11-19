import type { Price } from "./product";
import type { Platform } from "./platform";

export interface ProductSuggestion {
  slug: string;
  title: string;
  imageUrl: string;
  isDlc: boolean;
  platform: Platform;
  basePriceCents: number;
  currency: string;
  price: Price;
}

export interface ProductSuggestionsResponse {
  items: ProductSuggestion[];
  total: number;
}
