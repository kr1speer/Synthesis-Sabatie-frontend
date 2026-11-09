import type { FC, ReactNode } from "react";
import { TabBar } from "./TabBar";

export interface AppLayoutProps {
  contentClassName?: string;
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({
  contentClassName = "",
  children,
}) => (
  <div className="mobile-container">
    <header className="app-header">
      <h1 className="app-title">Синтез метана Сабатье</h1>
    </header>

    <main className={`content-area ${contentClassName}`.trim()}>{children}</main>

    <TabBar />
  </div>
);
