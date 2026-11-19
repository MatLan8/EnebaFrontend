import type { ProductType } from "../constants/productType";
import type { Region } from "../constants/region";
import type { Platform } from "./platform";

export interface Price {
  cents: number;
  discountPercent: number | null;
  currency: string;
}

export interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  type: ProductType;
  platform: Platform;
  region: Region;
  basePriceCents: number;
  currency: string;
  price: Price;
  cheapestOfferId: string;
}

export interface GetProductsResponse {
  items: ProductListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListParams {
  types: string[];
  platforms: string[];
  regions: string[];
  genres: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: string;
  page: number;
  q?: string;
}
