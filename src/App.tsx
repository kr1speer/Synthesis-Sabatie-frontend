import type { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import FeedPage from "./pages/FeedPage";
import MaterialPage from "./pages/MaterialPage";
import { ROUTES } from "./Routes";

/** Маршруты приложения: плитка материалов, лента и материал,
 *  открытый по идентификатору. Остальные адреса ведут на плитку. */
const App: FC = () => (
  <BrowserRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <Routes>
      <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
      <Route path={ROUTES.FEED} element={<FeedPage />} />
      <Route path={`${ROUTES.MATERIAL}/:id`} element={<MaterialPage />} />
      <Route path="*" element={<Navigate to={ROUTES.CATALOG} replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
