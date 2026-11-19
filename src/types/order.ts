import type { Platform } from "./platform";

export type OrderStatus = "pending" | "paid" | "cancelled";

export interface OrderListItem {
  id: string;
  publicId: string;
  createdAt: string;
  status: OrderStatus;
  productTitle: string | null;
  platform: Platform | null;
  itemCount: number;
  totalCents: number;
  currency: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type GetOrdersResponse = Paginated<OrderListItem>;
