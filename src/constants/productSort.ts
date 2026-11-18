export const ProductSort = {
  Popular: "popular",
  PriceAsc: "price_asc",
  PriceDesc: "price_desc",
  Newest: "newest",
  Oldest: "oldest",
  NameAsc: "name_asc",
  NameDesc: "name_desc",
} as const;

export type ProductSort = (typeof ProductSort)[keyof typeof ProductSort];

export const productSorts: { value: ProductSort; label: string; ascending: boolean }[] = [
  { value: ProductSort.PriceAsc, label: "Price: Low to High", ascending: true },
  { value: ProductSort.PriceDesc, label: "Price: High to Low", ascending: false },
  { value: ProductSort.Newest, label: "Date: Newest First", ascending: false },
  { value: ProductSort.Oldest, label: "Date: Oldest First", ascending: true },
  { value: ProductSort.Popular, label: "Popularity: Most popular", ascending: false },
  { value: ProductSort.NameAsc, label: "Alphabet: A-Z", ascending: true },
  { value: ProductSort.NameDesc, label: "Alphabet: Z-A", ascending: false },
];
