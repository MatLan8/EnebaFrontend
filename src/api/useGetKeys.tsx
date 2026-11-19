import { useQuery } from "@tanstack/react-query";
import { authorizedRequest } from "./authorizedRequest";
import { API_BASE, API_ROUTES } from "./endpoints";
import type { GetKeysResponse } from "../types/keys";

export const useGetKeys = (page: number, q: string) => {
  return useQuery<GetKeysResponse, Error>({
    queryKey: ["keys", page, q],
    queryFn: () =>
      authorizedRequest<GetKeysResponse>({
        method: "GET",
        url: `${API_BASE}${API_ROUTES.Keys.list}`,
        params: { page, q: q || undefined },
      }),
  });
};
