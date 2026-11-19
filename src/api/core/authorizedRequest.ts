import axios, { type AxiosRequestConfig } from "axios";
import { getAccessToken } from "../../auth/accessToken";
import { refreshSession, waitForRefresh } from "../../auth/refreshSession";
import type { ApiError } from "../../types/apiError";

const invalidToken = (error: unknown) =>
  axios.isAxiosError<ApiError>(error) &&
  error.response?.status === 401 &&
  error.response.data?.error?.code === "invalid_token";

export async function authorizedRequest<T>(
  config: AxiosRequestConfig,
  retried = false,
): Promise<T> {
  if (!retried) await waitForRefresh();

  const token = getAccessToken();
  try {
    const { data } = await axios.request<T>({
      ...config,
      withCredentials: true,
      headers: {
        ...config.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return data;
  } catch (error) {
    if (retried || !invalidToken(error)) throw error;

    const session = await refreshSession();
    if (!session) throw error;
    return authorizedRequest<T>(config, true);
  }
}
