import axios from "axios";
import { API_BASE, API_ROUTES } from "../api/core/endpoints";
import type { AuthResponse } from "../types/auth";
import { setAccessToken } from "./accessToken";
import { writeLoggedIn } from "./session";

let refreshPromise: Promise<AuthResponse | null> | null = null;

const requestRefresh = async () => {
  try {
    const { data } = await axios.post<AuthResponse>(
      `${API_BASE}${API_ROUTES.Auth.refresh}`,
      undefined,
      { withCredentials: true },
    );
    setAccessToken(data.accessToken);
    writeLoggedIn(true);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      setAccessToken(null);
      writeLoggedIn(false);
      return null;
    }
    throw error;
  }
};

export const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = requestRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const waitForRefresh = () => refreshPromise ?? Promise.resolve(null);
