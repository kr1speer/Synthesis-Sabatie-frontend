import type { FC, ReactNode } from "react";
import { selectRequestInProgress, useAppSelector } from "../store";
import { BlockingLoader } from "./BlockingLoader";
import { TabBar } from "./TabBar";

export interface AppLayoutProps {
  contentClassName?: string;
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({
  contentClassName = "",
  children,
}) => {
  const requestInProgress = useAppSelector(selectRequestInProgress);
  const { isAuthenticated, chemistLogin } = useAppSelector(
    (state) => state.chemistUser,
  );
  const usingMock = useAppSelector((state) => state.sabatierMaterials.usingMock);

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1 className="app-title">Синтез метана Сабатье</h1>
        <p className="app-subtitle">
          {isAuthenticated ? (
            <>
              Инженер-технолог <strong>{chemistLogin}</strong>
            </>
          ) : (
            <>Гость{usingMock && " · данные из mock-объектов"}</>
          )}
        </p>
      </header>

      <main className={`content-area ${contentClassName}`.trim()}>
        {children}
      </main>

      <TabBar />

      {requestInProgress && <BlockingLoader />}
    </div>
  );
};
