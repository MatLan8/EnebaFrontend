import type { Price } from "./product";

export interface ProductSuggestion {
  slug: string;
  title: string;
  imageUrl: string;
  isDlc: boolean;
  basePriceCents: number;
  currency: string;
  price: Price;
}

export interface ProductSuggestionsResponse {
  items: ProductSuggestion[];
  total: number;
}
