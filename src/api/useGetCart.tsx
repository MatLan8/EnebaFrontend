import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CartResponse } from "../types/cart";
import { API_BASE, API_ROUTES } from "./endpoints";

export const cartQueryKey = ["cart"] as const;

export const useGetCart = (enabled: boolean) => {
  return useQuery<CartResponse, Error>({
    queryKey: cartQueryKey,
    enabled,
    staleTime: Infinity,
    queryFn: async () => {
      const { data } = await axios.get<CartResponse>(`${API_BASE}${API_ROUTES.Cart.get}`, {
        withCredentials: true,
      });
      return data;
    },
  });
};
