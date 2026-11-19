import { useState } from "react";
import { useGetKeys } from "../../api/keys/useGetKeys";
import { AccountLayout } from "../../components/account/AccountLayout/AccountLayout";
import { AccountQueryState } from "../../components/account/AccountQueryState/AccountQueryState";
import { TextField } from "../../components/inputs/TextField/TextField";
import { KeysTable } from "../../components/keys/KeysTable/KeysTable";
import { Pagination } from "../../components/store/Pagination/Pagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import styles from "./KeysLibrary.module.css";

const searchDelayMs = 400;

export function KeysLibrary() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, searchDelayMs);
  const query = search.trim() === "" ? "" : (debouncedSearch ?? "").trim();
  const keys = useGetKeys(page, query);
  const data = keys.data;

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <AccountLayout title="My library">
      <div className={styles.filters}>
        <TextField
          variant="light"
          className={styles.search}
          value={search}
          onChange={changeSearch}
          placeholder="Search by product name / order id"
          name="q"
          autoComplete="off"
          maxLength={100}
        />
      </div>
      <AccountQueryState
        isPending={keys.isPending}
        error={keys.error}
        isEmpty={data?.items.length === 0}
        emptyMessage={query ? `No keys found matching “${query}”.` : "No keys found."}
        loadingLabel="Loading your keys"
        unauthorizedMessage="Log in to see your keys."
        loginMessage="To see your keys, you have to be logged-in."
      />
      {data && data.items.length > 0 && (
        <>
          <KeysTable items={data.items} />
          {data.totalPages > 1 && (
            <Pagination
              variant="light"
              page={page}
              totalPages={data.totalPages}
              onChange={setPage}
            />
          )}
        </>
      )}
    </AccountLayout>
  );
}
