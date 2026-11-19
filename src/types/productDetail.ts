import type { ProductType } from "../constants/productType";
import type { Region } from "../constants/region";
import type { Platform } from "./platform";
import type { Price } from "./product";

export interface OfferSeller {
  id: string;
  name: string;
  logoUrl: string | null;
  rating: number;
}

export interface Offer {
  id: string;
  price: Price;
  seller: OfferSeller;
}

export interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  type: ProductType;
  platform: Platform;
  region: Region;
  developer: string | null;
  publisher: string | null;
  releaseDate: string;
  basePriceCents: number;
  currency: string;
  genres: { slug: string; name: string }[];
  offers: Offer[];
}
