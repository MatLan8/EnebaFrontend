const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const formatDateTime = (value: string) => dateTimeFormat.format(new Date(value));
