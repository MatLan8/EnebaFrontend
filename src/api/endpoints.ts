export const API_BASE = import.meta.env.VITE_BASE_URL;

export const API_ROUTES = {
  Auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
  Home: {
    getBlocks: "/home",
  },
  Products: {
    get: "/products",
    getFilters: "/products/filters",
    getSuggestions: "/products/suggestions",
    getBySlug: "/products/",
  },
  Checkout: {
    create: "/checkout",
  },
  Cart: {
    get: "/cart",
    clear: "/cart",
    addItem: "/cart/items",
    item: (offerId: string) => `/cart/items/${offerId}`,
  },
};
