import type { Paginated } from "./order";
import type { Platform } from "./platform";

export interface KeyListItem {
  id: string;
  orderId: string;
  publicId: string;
  purchasedAt: string;
  sellerName: string;
  productTitle: string;
  productImageUrl: string;
  platform: Platform;
  priceCents: number;
  currency: string;
}

export type GetKeysResponse = Paginated<KeyListItem>;
