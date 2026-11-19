import { useMutation } from "@tanstack/react-query";
import { authorizedRequest } from "./authorizedRequest";
import { API_BASE, API_ROUTES } from "./endpoints";

export interface CheckoutResponse {
  orderId: string;
  checkoutUrl: string;
}

export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, void>({
    mutationFn: () =>
      authorizedRequest<CheckoutResponse>({
        method: "POST",
        url: `${API_BASE}${API_ROUTES.Checkout.create}`,
      }),
  });
};
