import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { CartResponse } from "../types/cart";
import { API_BASE, API_ROUTES } from "./endpoints";
import { cartQueryKey } from "./useGetCart";

interface UpdateCartItemInput {
  offerId: string;
  quantity: number;
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, UpdateCartItemInput>({
    mutationFn: async ({ offerId, quantity }) => {
      const { data } = await axios.patch<CartResponse>(
        `${API_BASE}${API_ROUTES.Cart.item(offerId)}`,
        { quantity },
        { withCredentials: true },
      );
      return data;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
  });
};
