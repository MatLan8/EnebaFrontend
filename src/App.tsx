import { Route, Routes, useLocation } from "react-router-dom";
import { CheckoutFooter } from "./components/checkout/CheckoutFooter/CheckoutFooter";
import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";
import { ProductPage } from "./pages/ProductPage/ProductPage";
import { StorePage } from "./pages/StorePage/StorePage";
import { ROUTES } from "./routes/paths";
import styles from "./App.module.css";

function App() {
  const location = useLocation();
  const resetKey = (location.state as { reset?: number } | null)?.reset ?? 0;
  const isCheckout = location.pathname === ROUTES.checkout;
  const isAuth = location.pathname === ROUTES.login || location.pathname === ROUTES.register;

  return (
    <div className={styles.app}>
      {!isCheckout && !isAuth && <Header />}
      <div className={styles.content}>
        <Routes>
          <Route path={ROUTES.store} element={<StorePage key={resetKey} />} />
          <Route path={ROUTES.product} element={<ProductPage />} />
          <Route path={ROUTES.checkout} element={<CheckoutPage />} />
          <Route path={ROUTES.login} element={<AuthPage mode="login" />} />
          <Route path={ROUTES.register} element={<AuthPage mode="register" />} />
        </Routes>
      </div>
      {isCheckout ? <CheckoutFooter /> : isAuth ? null : <Footer />}
    </div>
  );
}

export default App;
