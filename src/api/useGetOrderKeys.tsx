import { useQuery } from "@tanstack/react-query";
import { authorizedRequest } from "./authorizedRequest";
import { API_BASE, API_ROUTES } from "./endpoints";
import type { OrderKeysResponse } from "../types/orderKeys";

export const useGetOrderKeys = (orderId: string) => {
  return useQuery<OrderKeysResponse, Error>({
    queryKey: ["orderKeys", orderId],
    enabled: orderId.length > 0,
    gcTime: 0,
    queryFn: () =>
      authorizedRequest<OrderKeysResponse>({
        method: "GET",
        url: `${API_BASE}${API_ROUTES.Orders.keys(orderId)}`,
      }),
  });
};