const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

export const formatDateTime = (value: string) => dateTimeFormat.format(new Date(value));

export const formatDate = (value: string) => dateFormat.format(new Date(value));
