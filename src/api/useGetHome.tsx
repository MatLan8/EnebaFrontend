import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { HomeResponse } from "../types/home";
import { API_BASE, API_ROUTES } from "./endpoints";

export const useGetHome = () => {
  return useQuery<HomeResponse, Error>({
    queryKey: ["home"],
    queryFn: async () => {
      const { data } = await axios.get<HomeResponse>(`${API_BASE}${API_ROUTES.Home.getBlocks}`);
      return data;
    },
  });
};
