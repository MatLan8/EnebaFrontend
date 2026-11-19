import axios from "axios";
import type { ApiErrorBody } from "../types/auth";

export const readApiErrors = (error: unknown) => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return ["Something went wrong. Please try again."];
  }

  const details = error.response?.data?.error?.details;
  if (details) {
    const messages = Object.values(details).map(String);
    if (messages.length > 0) return messages;
  }

  const message = error.response?.data?.error?.message;
  return [message ?? "Something went wrong. Please try again."];
};
