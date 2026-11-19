import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { AuthResponse } from "../types/auth";
import { API_BASE, API_ROUTES } from "./endpoints";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

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
