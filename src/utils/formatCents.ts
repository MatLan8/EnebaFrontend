export const formatCents = (cents: number, currency: string, locale?: string) =>
  (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency,
  });
