import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { setAccessToken } from "../auth/accessToken";
import { writeLoggedIn } from "../auth/session";
import { API_BASE, API_ROUTES } from "./endpoints";
import { currentUserQueryKey } from "./useGetMe";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await axios.post(`${API_BASE}${API_ROUTES.Auth.logout}`, undefined, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      setAccessToken(null);
      writeLoggedIn(false);
      queryClient.removeQueries({ queryKey: currentUserQueryKey });
    },
  });
};
