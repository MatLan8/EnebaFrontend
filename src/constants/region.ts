export const Region = {
  Global: "global",
  Europe: "europe",
  NorthAmerica: "north_america",
  Uk: "uk",
  LatAm: "latam",
  Asia: "asia",
} as const;

export type Region = (typeof Region)[keyof typeof Region];
