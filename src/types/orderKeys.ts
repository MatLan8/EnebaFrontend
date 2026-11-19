import type { ProductType } from "../constants/productType";
import type { Region } from "../constants/region";
import type { Platform } from "./platform";

export interface OrderKeyProduct {
  title: string;
  imageUrl: string;
  type: ProductType;
  platform: Platform;
  region: Region;
}

export interface OrderKeySeller {
  name: string;
  logoUrl: string | null;
  rating: number;
}

export interface OrderKey {
  id: string;
  code: string;
  product: OrderKeyProduct;
  seller: OrderKeySeller;
}

export interface OrderKeysResponse {
  orderId: string;
  keys: OrderKey[];
}
