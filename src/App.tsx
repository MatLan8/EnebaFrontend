import { Route, Routes, useLocation } from "react-router-dom";
import { CheckoutFooter } from "./components/checkout/CheckoutFooter/CheckoutFooter";
import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";
import { StorePage } from "./pages/StorePage/StorePage";
import { ROUTES } from "./routes/paths";
import styles from "./App.module.css";

function App() {
  const location = useLocation();
  const resetKey = (location.state as { reset?: number } | null)?.reset ?? 0;
  const isCheckout = location.pathname === ROUTES.checkout;

  return (
    <div className={styles.app}>
      {!isCheckout && <Header />}
      <div className={styles.content}>
        <Routes>
          <Route path={ROUTES.store} element={<StorePage key={resetKey} />} />
          <Route path={ROUTES.checkout} element={<CheckoutPage />} />
        </Routes>
      </div>
      {isCheckout ? <CheckoutFooter /> : <Footer />}
    </div>
  );
}

export default App;
