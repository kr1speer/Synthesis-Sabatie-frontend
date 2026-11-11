import type { FC } from "react";
import { Spinner } from "react-bootstrap";

/**
 * Анимация на время запроса к веб-сервису. Перекрывает страницу целиком
 * вместе с навигационной панелью, поэтому ни одна кнопка в это время
 * не нажимается.
 */
export const BlockingLoader: FC = () => (
  <div className="blocking-loader" role="status" aria-live="polite">
    <Spinner animation="border" />
    <span className="blocking-loader-text">Запрос к веб-сервису…</span>
  </div>
);
