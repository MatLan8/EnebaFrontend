import { useMutation } from "@tanstack/react-query";
import type { CheckoutResponse } from "../../types/checkout";
import { authorizedRequest } from "../core/authorizedRequest";
import { API_BASE, API_ROUTES } from "../core/endpoints";

export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, void>({
    mutationFn: () =>
      authorizedRequest<CheckoutResponse>({
        method: "POST",
        url: `${API_BASE}${API_ROUTES.Checkout.create}`,
      }),
  });
};
