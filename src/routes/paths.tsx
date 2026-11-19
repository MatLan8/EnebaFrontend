export const ROUTES = {
  homepage: "/",
  store: "/store",
  checkout: "/checkout",
  product: "/product/:slug",
  login: "/login",
  register: "/register",
  redeemKeys: "/redeem-keys",
  orders: "/orders",
  keysLibrary: "/keys",
} as const;

export const productPath = (slug: string) => `/product/${slug}`;

export const redeemKeysPath = (orderId: string, keyId?: string) =>
  `${ROUTES.redeemKeys}${keyId ? `?key=${encodeURIComponent(keyId)}` : ""}#${encodeURIComponent(orderId)}`;
