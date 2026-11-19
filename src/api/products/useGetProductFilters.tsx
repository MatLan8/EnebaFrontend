import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProductFiltersResponse } from "../../types/productFilters";
import { API_BASE, API_ROUTES } from "../core/endpoints";

export const useGetProductFilters = () => {
  return useQuery<ProductFiltersResponse, Error>({
    queryKey: ["productFilters"],
    queryFn: async () => {
      const { data } = await axios.get<ProductFiltersResponse>(
        `${API_BASE}${API_ROUTES.Products.getFilters}`,
      );
      return data;
    },
  });
};
