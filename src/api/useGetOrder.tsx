import { useQuery } from "@tanstack/react-query";
import { authorizedRequest } from "./authorizedRequest";
import { API_BASE, API_ROUTES } from "./endpoints";
import type { OrderDetail } from "../types/order";

export const useGetOrder = (orderId: string) => {
  return useQuery<OrderDetail, Error>({
    queryKey: ["order", orderId],
    enabled: orderId.length > 0,
    queryFn: () =>
      authorizedRequest<OrderDetail>({
        method: "GET",
        url: `${API_BASE}${API_ROUTES.Orders.get(orderId)}`,
      }),
  });
};
