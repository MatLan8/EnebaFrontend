import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GetProductsResponse } from "../types/product";
import { API_BASE, API_ROUTES } from "./endpoints";

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

const buildProductsUrl = (params: ProductListParams) => {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", "24");
  search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);

  for (const type of params.types) search.append("type", type);
  for (const platform of params.platforms) search.append("platform", platform);
  for (const region of params.regions) search.append("region", region);
  for (const genre of params.genres) search.append("genre", genre);
  if (params.minPrice !== undefined) search.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) search.set("maxPrice", String(params.maxPrice));

  return `${API_BASE}${API_ROUTES.Products.get}?${search.toString()}`;
};

export const useGetProducts = (params: ProductListParams) => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["getProducts", params],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await axios.get<GetProductsResponse>(buildProductsUrl(params));
      return data;
    },
  });
};
