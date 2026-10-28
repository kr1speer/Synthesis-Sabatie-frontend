import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../Routes";
import {
  AddIcon,
  CatalogIcon,
  FeedIcon,
  LoginIcon,
  type TabIconProps,
} from "./TabBarIcons";

interface TabItem {
  label: string;
  route: string;
  Icon: FC<TabIconProps>;
  available: boolean;
}

const TAB_ITEMS: TabItem[] = [
  { label: "Лента", route: ROUTES.FEED, Icon: FeedIcon, available: true },
  { label: "Добавление", route: ROUTES.DRAFT, Icon: AddIcon, available: false },
  { label: "Плитка", route: ROUTES.CATALOG, Icon: CatalogIcon, available: true },
  { label: "Вход", route: ROUTES.LOGIN, Icon: LoginIcon, available: false },
];

export const TabBar: FC = () => {
  const { pathname } = useLocation();

  const isActive = (route: string): boolean =>
    route === ROUTES.CATALOG ? pathname === route : pathname.startsWith(route);

  return (
    <nav className="bottom-navbar">
      {TAB_ITEMS.map(({ label, route, Icon, available }) => {
        const active = available && isActive(route);
        const className = `nav-item${active ? " active" : ""}${
          available ? "" : " disabled"
        }`;

        const content = (
          <>
            <Icon active={active} />
            <span>{label}</span>
          </>
        );

        return available ? (
          <Link key={label} to={route} className={className}>
            {content}
          </Link>
        ) : (
          <span key={label} className={className} aria-disabled="true">
            {content}
          </span>
        );
      })}
    </nav>
  );
};
