import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { readApiErrors } from "../../api/readApiErrors";
import { useGetOrders } from "../../api/useGetOrders";
import { AccountLayout } from "../../components/account/AccountLayout/AccountLayout";
import { LinkButton } from "../../components/buttons/LinkButton";
import { LoginRequiredModal } from "../../components/checkout/LoginRequiredModal/LoginRequiredModal";
import { TextField } from "../../components/inputs/TextField/TextField";
import { OrdersTable } from "../../components/orders/OrdersTable/OrdersTable";
import { Spinner } from "../../components/Spinner/Spinner";
import { Pagination } from "../../components/store/Pagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import styles from "./OrdersPage.module.css";

const searchDelayMs = 400;

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loginDismissed, setLoginDismissed] = useState(false);
  const debouncedSearch = useDebouncedValue(search, searchDelayMs);
  const publicId = search.trim() === "" ? "" : (debouncedSearch ?? "").trim();
  const orders = useGetOrders(page, publicId);
  const unauthorized = axios.isAxiosError(orders.error) && orders.error.response?.status === 401;
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
    <AccountLayout>
      <h1 className={styles.heading}>Orders</h1>
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
      {orders.isPending && (
        <div className={styles.loading}>
          <Spinner className={styles.spinner} label="Loading orders" />
        </div>
      )}
      {unauthorized && <p className={styles.message}>Log in to see your orders.</p>}
      {orders.isError && !unauthorized && (
        <div className={styles.error} role="alert">
          {readApiErrors(orders.error).map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
      {data && data.items.length === 0 && (
        <p className={styles.message}>
          {publicId ? `No orders found matching “${publicId}”.` : "No orders found."}
        </p>
      )}
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
      {unauthorized &&
        !loginDismissed &&
        createPortal(
          <LoginRequiredModal
            message="To see your orders, you have to be logged-in."
            onClose={() => setLoginDismissed(true)}
          />,
          document.body,
        )}
    </AccountLayout>
  );
}
