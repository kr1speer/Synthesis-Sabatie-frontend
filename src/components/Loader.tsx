import type { FC } from "react";
import { Spinner } from "react-bootstrap";

/** Состояние загрузки данных. */
export const Loader: FC = () => (
  <div className="loader-box">
    <Spinner animation="border" role="status" />
  </div>
);
