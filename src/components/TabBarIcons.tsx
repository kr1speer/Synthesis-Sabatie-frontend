import type { FC } from "react";

/** Иконки нижней навигационной панели.
 *
 *  Нарисованы как SVG, а не подключены картинками: цвет берётся из
 *  currentColor, поэтому активный пункт синий, остальные приглушённые,
 *  и одна и та же иконка остаётся чёткой на любом экране.
 *
 *  Свойство active переключает начертание: у выбранного пункта фигура
 *  залита, у остальных нарисована контуром. */
export interface TabIconProps {
  active: boolean;
}

/** Лента — стопка карточек, листаемых одна за другой. */
export const FeedIcon: FC<TabIconProps> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="3"
      y="6"
      width="12"
      height="14"
      rx="2.5"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M17.5 8.2h1.2a2 2 0 0 1 2 2v7.3a2 2 0 0 1-2 2h-1.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M15.8 4.5h1a2 2 0 0 1 2 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/** Добавление — круг со знаком «плюс». */
export const AddIcon: FC<TabIconProps> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="8.6"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 8.2v7.6M8.2 12h7.6"
      stroke={active ? "#ffffff" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/** Плитка — четыре квадрата в два столбца. */
export const CatalogIcon: FC<TabIconProps> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    {[
      [3.5, 3.5],
      [13.5, 3.5],
      [3.5, 13.5],
      [13.5, 13.5],
    ].map(([x, y]) => (
      <rect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width="7"
        height="7"
        rx="1.8"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    ))}
  </svg>
);

/** Вход — четвёртая иконка панели: дверь со стрелкой внутрь. */
export const LoginIcon: FC<TabIconProps> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M13.5 3.5h4.2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-4.2"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12h8.4M9.3 8.6l3.4 3.4-3.4 3.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
