import type { FC } from "react";
import { Spinner } from "react-bootstrap";

export const BlockingLoader: FC = () => (
  <div className="blocking-loader" role="status" aria-live="polite">
    <Spinner animation="border" />
    <span className="blocking-loader-text">Запрос к веб-сервису…</span>
  </div>
);
