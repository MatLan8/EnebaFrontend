import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GetProductsResponse } from "../types/product";
import { API_BASE, API_ROUTES } from "./endpoints";

export const useGetProducts = () => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["getProducts"],
    queryFn: async () => {
      const { data } = await axios.get<GetProductsResponse>(
        `${API_BASE}${API_ROUTES.Products.get}`,
      );
      return data;
    },
  });
};
