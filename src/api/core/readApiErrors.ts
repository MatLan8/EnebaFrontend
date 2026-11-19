import axios from "axios";
import type { ApiError } from "../../types/apiError";

const fallbackMessage = "Something went wrong. Please try again.";

export const readApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError<ApiError>(error)) return fallbackMessage;
  return error.response?.data?.error?.message ?? fallbackMessage;
};

export const readApiErrors = (error: unknown) => {
  if (!axios.isAxiosError<ApiError>(error)) {
    return [fallbackMessage];
  }

  const details = error.response?.data?.error?.details;
  if (details) {
    const messages = Object.values(details).map(String);
    if (messages.length > 0) return messages;
  }

  return [readApiErrorMessage(error)];
};
