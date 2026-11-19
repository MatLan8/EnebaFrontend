const loggedInKey = "isLoggedIn";

export const readLoggedIn = () => window.localStorage.getItem(loggedInKey) === "true";

export const writeLoggedIn = (value: boolean) => {
  window.localStorage.setItem(loggedInKey, value ? "true" : "false");
};
