import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductSuggestions } from "../../../api/useGetProductSuggestions";
import { HistoryClockIcon } from "../../../icons/HistoryIcon";
import { SearchIcon } from "../../../icons/SearchIcon";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ROUTES } from "../../../routes/paths";
import { NoMatches } from "../../NoMatches/NoMatches";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SearchSuggestionCard } from "../SearchSuggestionCard/SearchSuggestionCard";
import styles from "./SearchBar.module.css";

const recentSearchesKey = "eneba-recent-searches";
const suggestionDelayMs = 300;
const maxRecentSearches = 3;

const readRecentSearches = () => {
  const stored = window.localStorage.getItem(recentSearchesKey);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(0, maxRecentSearches)
      : [];
  } catch {
    return [];
  }
};

const writeRecentSearches = (searches: string[]) => {
  window.localStorage.setItem(recentSearchesKey, JSON.stringify(searches));
};

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetKey = (location.state as { reset?: number } | null)?.reset ?? 0;
  const [query, setQuery] = useState("");
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setQuery("");
  }
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(readRecentSearches);
  const rootRef = useRef<HTMLDivElement>(null);
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, suggestionDelayMs) ?? "";
  const suggestionQuery = [...debouncedQuery].length >= 3 ? debouncedQuery : "";
  const suggestions = useGetProductSuggestions(suggestionQuery, suggestionQuery.length > 0);
  const searching = [...trimmedQuery].length >= 3;

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const saveSearch = (term: string) => {
    const value = term.trim();
    if (!value) return;

    setRecentSearches((current) => {
      const next = [
        value,
        ...current.filter((item) => item.toLowerCase() !== value.toLowerCase()),
      ].slice(0, maxRecentSearches);
      writeRecentSearches(next);
      return next;
    });
  };

  const removeSearch = (term: string) => {
    setRecentSearches((current) => {
      const next = current.filter((item) => item !== term);
      writeRecentSearches(next);
      return next;
    });
  };

  const searchStore = () => {
    const term = query.trim();
    if (!term) return;

    saveSearch(term);
    setOpen(false);
    navigate(`${ROUTES.store}?${new URLSearchParams({ q: term }).toString()}`);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    searchStore();
  };

  const showPopularProducts = () => {
    setOpen(false);
    setQuery("");
    navigate(ROUTES.store, { state: { reset: Date.now() } });
  };

  const products = suggestions.data?.items.slice(0, 6) ?? [];
  const showResults = searching && suggestionQuery === trimmedQuery && suggestions.data;
  const noMatches = showResults && suggestions.data.total === 0;

  return (
    <>
      {open && <div className={styles.backdrop} aria-hidden="true" />}
      <div className={open ? `${styles.search} ${styles.searchOpen}` : styles.search} ref={rootRef}>
        <form className={styles.field} onSubmit={submit} role="search">
          <SearchIcon className={styles.icon} />
          <input
            className={styles.input}
            value={query}
            placeholder="Search for games, top-ups and more"
            aria-label="Search"
            aria-expanded={open}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
          />
          {query && (
            <button
              type="button"
              className={styles.clear}
              aria-label="Clear search text"
              onClick={() => setQuery("")}
            >
              ×
            </button>
          )}
        </form>
        {open && (
          <div className={styles.panel}>
            {!searching && recentSearches.length > 0 && (
              <div className={styles.recentBlock}>
                <p className={styles.recentLabel}>Recent searches</p>
                <ul className={styles.recent}>
                  {recentSearches.map((item) => (
                    <li key={item} className={styles.recentRow}>
                      <button
                        type="button"
                        className={styles.recentItem}
                        onClick={() => setQuery(item)}
                      >
                        <HistoryClockIcon className={styles.recentIcon} />
                        <span>{item}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.remove}
                        aria-label={`Remove ${item} from recent searches`}
                        onClick={() => removeSearch(item)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!searching && recentSearches.length === 0 && (
              <p className={styles.empty}>Search for product</p>
            )}
            {noMatches && <NoMatches onViewPopular={showPopularProducts} />}
            {showResults && !noMatches && (
              <>
                <ul className={styles.results}>
                  {products.map((product) => (
                    <li key={product.slug}>
                      <SearchSuggestionCard product={product} />
                    </li>
                  ))}
                </ul>
                <SecondaryButton className={styles.showAll} onClick={searchStore}>
                  Show all {suggestions.data.total} results
                </SecondaryButton>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
