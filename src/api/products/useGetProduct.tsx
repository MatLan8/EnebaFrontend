import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProductDetail } from "../../types/productDetail";
import { API_BASE, API_ROUTES } from "../core/endpoints";

export const useGetProduct = (slug: string) => {
  return useQuery<ProductDetail, Error>({
    queryKey: ["product", slug],
    enabled: slug.length > 0,
    queryFn: async () => {
      const { data } = await axios.get<ProductDetail>(
        `${API_BASE}${API_ROUTES.Products.getBySlug}${encodeURIComponent(slug)}`,
      );
      return data;
    },
  });
};
