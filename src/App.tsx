import type { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import DraftPage from "./pages/DraftPage";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import { ROUTES } from "./Routes";

const App: FC = () => (
  <BrowserRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <Routes>
      <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
      <Route path={ROUTES.FEED} element={<FeedPage />} />
      <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
      <Route path={ROUTES.DRAFT} element={<DraftPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="*" element={<Navigate to={ROUTES.CATALOG} replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
