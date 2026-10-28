import type { FC, ReactNode } from "react";
import { TabBar } from "./TabBar";

/** Общая разметка всех страниц: мобильный контейнер, шапка с названием
 *  системы и закреплённая снизу навигационная панель. Содержимое страницы
 *  приходит через props.children и прокручивается между ними. */
export interface AppLayoutProps {
  /** Дополнительный класс для области содержимого: на плитке нужны поля,
   *  в ленте видео занимает всю площадь без отступов. */
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
