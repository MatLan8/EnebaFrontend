export const Region = {
  Global: "global",
  Europe: "europe",
  NorthAmerica: "north_america",
  Uk: "uk",
  LatAm: "latam",
  Asia: "asia",
} as const;

export type Region = (typeof Region)[keyof typeof Region];

export const regionNames: Record<Region, string> = {
  global: "Global",
  europe: "Europe",
  north_america: "North America",
  uk: "UK",
  latam: "LatAm",
  asia: "Asia",
};
