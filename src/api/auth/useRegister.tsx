import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { AuthResponse, RegisterRequest } from "../../types/auth";
import { API_BASE, API_ROUTES } from "../core/endpoints";

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (body) => {
      const { data } = await axios.post<AuthResponse>(
        `${API_BASE}${API_ROUTES.Auth.register}`,
        body,
        { withCredentials: true },
      );
      return data;
    },
  });
};
