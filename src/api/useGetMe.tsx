import { useQuery } from "@tanstack/react-query";
import { authorizedRequest } from "./authorizedRequest";
import { API_BASE, API_ROUTES } from "./endpoints";
import type { User } from "../types/auth";

export const currentUserQueryKey = ["currentUser"] as const;

export const useGetMe = (enabled: boolean) => {
  return useQuery<User, Error>({
    queryKey: currentUserQueryKey,
    enabled,
    staleTime: Infinity,
    queryFn: () =>
      authorizedRequest<User>({
        method: "GET",
        url: `${API_BASE}${API_ROUTES.Users.me}`,
      }),
  });
};
