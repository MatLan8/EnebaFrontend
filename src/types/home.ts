import type { ProductType } from "../constants/productType";
import type { ProductListItem } from "./product";

export interface HomeBlock {
  title: string;
  productTypes: ProductType[];
  products: ProductListItem[];
}

export interface HomeResponse {
  blocks: HomeBlock[];
}
