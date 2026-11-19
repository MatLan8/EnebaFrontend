import { useQuery } from "@tanstack/react-query";
import { authorizedRequest } from "./authorizedRequest";
import { API_BASE, API_ROUTES } from "./endpoints";
import type { GetOrdersResponse } from "../types/order";

export const useGetOrders = (page: number, publicId: string) => {
  return useQuery<GetOrdersResponse, Error>({
    queryKey: ["orders", page, publicId],
    queryFn: () =>
      authorizedRequest<GetOrdersResponse>({
        method: "GET",
        url: `${API_BASE}${API_ROUTES.Orders.list}`,
        params: { page, publicId: publicId || undefined },
      }),
  });
};
