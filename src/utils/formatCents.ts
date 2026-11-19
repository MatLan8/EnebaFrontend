export const formatCents = (cents: number, currency: string) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
  });
