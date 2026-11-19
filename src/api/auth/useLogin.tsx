import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { AuthResponse, LoginRequest } from "../../types/auth";
import { API_BASE, API_ROUTES } from "../core/endpoints";

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (body) => {
      const { data } = await axios.post<AuthResponse>(
        `${API_BASE}${API_ROUTES.Auth.login}`,
        body,
        { withCredentials: true },
      );
      return data;
    },
  });
};
