import type { Platform } from "./platform";

export interface CartItem {
  offerId: string;
  quantity: number;
  availableQuantity: number;
  available: boolean;
  priceCents: number;
  currency: string;
  product: {
    slug: string;
    title: string;
    imageUrl: string;
    platform: Platform;
    isDlc: boolean;
  };
  seller: {
    name: string;
    logoUrl: string | null;
  };
}

export interface CartResponse {
  items: CartItem[];
  itemCount: number;
  totalCents: number;
  currency: string;
}
