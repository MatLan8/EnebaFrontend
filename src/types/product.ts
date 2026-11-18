import type { Platform } from "../constants/platform";
import type { ProductType } from "../constants/productType";
import type { Region } from "../constants/region";

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
}

export interface GetProductsResponse {
  items: ProductListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
