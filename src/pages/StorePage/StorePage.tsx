import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProductFilters } from "../../api/useGetProductFilters";
import {
  useGetProducts,
  type ProductListParams,
} from "../../api/useGetProducts";
import { ProductSort } from "../../constants/productSort";
import { ProductType } from "../../constants/productType";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { NoMatches } from "../../components/NoMatches/NoMatches";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { ROUTES } from "../../routes/paths";
import { FilterPills } from "../../components/filters/FilterPills/FilterPills";
import {
  emptyStoreFilters,
  StoreFilters,
  type StoreFilterValue,
} from "../../components/filters/StoreFilters/StoreFilters";
import { Pagination } from "../../components/store/Pagination";
import { ProductSortMenu } from "../../components/store/ProductSortMenu";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import styles from "./StorePage.module.css";

const filterDebounceMs = 300;

const eurosToCents = (raw: string) => {
  const trimmed = raw.trim().replace(",", ".");
  if (!trimmed) return undefined;

  const euros = Number(trimmed);
  if (!Number.isFinite(euros) || euros < 0) return undefined;
  return Math.round(euros * 100);
};

const toProductListParams = (
  value: StoreFilterValue,
  sort: ProductSort,
  page: number,
): ProductListParams | null => {
  const minPrice = eurosToCents(value.minPrice);
  const maxPrice = eurosToCents(value.maxPrice);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return null;
  }

  return {
    types: value.types,
    platforms: value.platforms,
    regions: value.regions,
    genres: value.genres,
    minPrice,
    maxPrice,
    sort,
    page,
  };
};

const serializeFilters = (value: StoreFilterValue) =>
  JSON.stringify({
    types: value.types,
    platforms: value.platforms,
    regions: value.regions,
    genres: value.genres,
    minPrice: value.minPrice,
    maxPrice: value.maxPrice,
  });

const readFilters = (key: string): StoreFilterValue => JSON.parse(key) as StoreFilterValue;

const productTypes: string[] = Object.values(ProductType);

const readUrlFilters = (searchParams: URLSearchParams): StoreFilterValue => ({
  ...emptyStoreFilters,
  types: [...new Set(searchParams.getAll("type"))].filter((type) => productTypes.includes(type)),
});

const formatResultCount = (total: number) => (total > 1000 ? "1000+" : String(total));

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchText = searchParams.get("q")?.trim() ?? "";
  const [filters, setFilters] = useState<StoreFilterValue>(() => readUrlFilters(searchParams));
  const [sort, setSort] = useState<ProductSort>(ProductSort.Popular);
  const [pageState, setPageState] = useState({ page: 1, searchText });
  const urlTypes = searchParams.getAll("type").join(",");
  const [appliedUrlTypes, setAppliedUrlTypes] = useState(urlTypes);
  if (urlTypes !== appliedUrlTypes) {
    setAppliedUrlTypes(urlTypes);
    if (urlTypes) {
      setFilters(readUrlFilters(searchParams));
      setPageState({ page: 1, searchText });
    }
  }
  const page = pageState.searchText === searchText ? pageState.page : 1;
  const setPage = (next: number) => setPageState({ page: next, searchText });
  const debouncedFilters = useDebouncedValue(serializeFilters(filters), filterDebounceMs);
  const productParams = useMemo(() => {
    const value = debouncedFilters ? readFilters(debouncedFilters) : emptyStoreFilters;
    const params =
      toProductListParams(value, sort, page) ?? toProductListParams(emptyStoreFilters, sort, page)!;
    return searchText ? { ...params, q: searchText } : params;
  }, [debouncedFilters, sort, page, searchText]);
  const productQuery = useGetProducts(productParams);
  const filtersQuery = useGetProductFilters();
  const products = productQuery.data?.items ?? [];
  const totalPages = productQuery.data?.totalPages ?? 0;

  const changeFilters = (next: StoreFilterValue) => {
    setFilters(next);
    setPage(1);
    if (searchParams.has("type")) {
      setSearchParams(
        (current) => {
          const nextParams = new URLSearchParams(current);
          nextParams.delete("type");
          return nextParams;
        },
        { replace: true },
      );
    }
  };

  const clearSearchText = () => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("q");
      return next;
    });
  };

  const showPopularProducts = () => {
    navigate(ROUTES.store, { state: { reset: Date.now() } });
  };

  const pills = (
    <FilterPills
      filters={filtersQuery.data}
      value={filters}
      onChange={changeFilters}
      searchText={searchText}
      onClearSearchText={clearSearchText}
    />
  );

  const noTextMatches =
    searchText.length > 0 &&
    !productQuery.isPlaceholderData &&
    productQuery.data?.total === 0;

  if (productQuery.isPending) {
    return (
      <main className={styles.page}>
        <PageLoader />
      </main>
    );
  }

  if (noTextMatches) {
    return (
      <main className={styles.page}>
        <h1 className={styles.heading}>Games, Gift Cards, Top-Ups & More | Best Deals</h1>
        {pills}
        <NoMatches onViewPopular={showPopularProducts} />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Games, Gift Cards, Top-Ups & More | Best Deals</h1>
      <div className={styles.layout}>
        <StoreFilters filters={filtersQuery.data} value={filters} onChange={changeFilters} />
        <section>
          {pills}
          <div className={styles.toolbar}>
            <p className={styles.results}>
              Results found: {productQuery.data ? formatResultCount(productQuery.data.total) : "–"}
            </p>
            <ProductSortMenu
              value={sort}
              onChange={(next) => {
                setSort(next);
                setPage(1);
              }}
            />
          </div>
          {productQuery.error && <p>Could not load products.</p>}
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </div>
    </main>
  );
}
