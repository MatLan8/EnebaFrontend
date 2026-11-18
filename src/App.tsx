import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/Header";
import { StorePage } from "./pages/StorePage/StorePage";
import { ROUTES } from "./routes/paths";

function App() {
  const location = useLocation();
  const resetKey = (location.state as { reset?: number } | null)?.reset ?? 0;

  return (
    <>
      <Header />
      <Routes>
        <Route path={ROUTES.store} element={<StorePage key={resetKey} />} />
      </Routes>
    </>
  );
}

export default App;
