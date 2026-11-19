import { useState } from "react";
import { useGetOrders } from "../../api/useGetOrders";
import { AccountLayout } from "../../components/account/AccountLayout/AccountLayout";
import { AccountQueryState } from "../../components/account/AccountQueryState/AccountQueryState";
import { LinkButton } from "../../components/buttons/LinkButton";
import { TextField } from "../../components/inputs/TextField/TextField";
import { OrdersTable } from "../../components/orders/OrdersTable/OrdersTable";
import { Pagination } from "../../components/store/Pagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import styles from "./OrdersPage.module.css";

const searchDelayMs = 400;

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, searchDelayMs);
  const publicId = search.trim() === "" ? "" : (debouncedSearch ?? "").trim();
  const orders = useGetOrders(page, publicId);
  const data = orders.data;

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <AccountLayout title="Orders">
      <div className={styles.filters}>
        <TextField
          variant="light"
          className={styles.search}
          value={search}
          onChange={changeSearch}
          placeholder="Search by order ID"
          name="publicId"
          autoComplete="off"
          maxLength={32}
        />
        <LinkButton className={styles.reset} onClick={resetFilters}>
          Reset filters
        </LinkButton>
      </div>
      <AccountQueryState
        isPending={orders.isPending}
        error={orders.error}
        isEmpty={data?.items.length === 0}
        emptyMessage={publicId ? `No orders found matching “${publicId}”.` : "No orders found."}
        loadingLabel="Loading orders"
        unauthorizedMessage="Log in to see your orders."
        loginMessage="To see your orders, you have to be logged-in."
      />
      {data && data.items.length > 0 && (
        <>
          <OrdersTable orders={data.items} />
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
