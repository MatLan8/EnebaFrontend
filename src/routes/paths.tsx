export const ROUTES = {
  homepage: "/",
  store: "/store",
  checkout: "/checkout",
  product: "/product/:slug",
  login: "/login",
  register: "/register",
  redeemKeys: "/redeem-keys",
  orders: "/orders",
  keysLibrary: "/my-library",
  orderDetails: "/order/:id",
  notFound: "*",
} as const;

export const productPath = (slug: string) => `/product/${slug}`;

export const storePath = (types: readonly string[] = []) => {
  const search = new URLSearchParams();
  for (const type of types) search.append("type", type);
  const query = search.toString();
  return query ? `${ROUTES.store}?${query}` : ROUTES.store;
};

export const orderDetailsPath = (orderId: string) => `/order/${encodeURIComponent(orderId)}`;

export const redeemKeysPath = (orderId: string, keyId?: string) =>
  `${ROUTES.redeemKeys}${keyId ? `?key=${encodeURIComponent(keyId)}` : ""}#${encodeURIComponent(orderId)}`;
