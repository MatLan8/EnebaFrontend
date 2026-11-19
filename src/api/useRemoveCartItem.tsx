import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { CartResponse } from "../types/cart";
import { API_BASE, API_ROUTES } from "./endpoints";
import { cartQueryKey } from "./useGetCart";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, string>({
    mutationFn: async (offerId) => {
      const { data } = await axios.delete<CartResponse>(
        `${API_BASE}${API_ROUTES.Cart.item(offerId)}`,
        { withCredentials: true },
      );
      return data;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
  });
};
