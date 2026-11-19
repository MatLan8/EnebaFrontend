import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProductSuggestionsResponse } from "../../types/productSuggestions";
import { API_BASE, API_ROUTES } from "../core/endpoints";

export const useGetProductSuggestions = (query: string, enabled: boolean) => {
  return useQuery<ProductSuggestionsResponse, Error>({
    queryKey: ["productSuggestions", query],
    enabled,
    queryFn: async () => {
      const { data } = await axios.get<ProductSuggestionsResponse>(
        `${API_BASE}${API_ROUTES.Products.getSuggestions}`,
        { params: { q: query } },
      );
      return data;
    },
  });
};
