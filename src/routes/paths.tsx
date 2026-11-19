export const ROUTES = {
  homepage: "/",
  store: "/store",
  checkout: "/checkout",
  product: "/product/:slug",
  login: "/login",
  register: "/register",
} as const;

export const productPath = (slug: string) => `/product/${slug}`;
