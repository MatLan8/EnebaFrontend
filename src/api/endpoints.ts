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
  Cart: {
    get: "/cart",
    deleteItem: "/cart/",
    removeItem: "/cart/",
    clear: "/cart",
    addItem: "/cart/",
    updateQuantity: "/cart/",
  },
};
