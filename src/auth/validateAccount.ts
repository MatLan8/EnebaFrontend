const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (value: string) => {
  const name = value.trim();
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be at most 50 characters";
  return null;
};

export const validateEmail = (value: string) => {
  const email = value.trim();
  if (!email) return "Email is required";
  if (email.length > 254) return "Email must be at most 254 characters";
  if (!emailPattern.test(email)) return "Email must be a valid email address";
  return null;
};

export const validatePassword = (value: string) => {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (value.length > 72) return "Password must be at most 72 characters";
  return null;
};

export const collectErrors = (...messages: Array<string | null>) =>
  messages.filter((message): message is string => message !== null);
