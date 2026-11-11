import axios from "axios";
import type { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  chemistUserLoggedOut,
  chemistUserRequestFailed,
  chemistUserRequestStarted,
} from "../slices/chemistUserSlice";
import { materialFilterReset } from "../slices/sabatierMaterialsSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { ROUTES } from "../Routes";
import {
  AddIcon,
  CatalogIcon,
  FeedIcon,
  LoginIcon,
  LogoutIcon,
  type TabIconProps,
} from "./TabBarIcons";

interface TabItem {
  label: string;
  route: string;
  Icon: FC<TabIconProps>;
  /** Пункт доступен гостю; остальные открываются после аутентификации */
  guestAllowed: boolean;
}

const TAB_ITEMS: TabItem[] = [
  { label: "Лента", route: ROUTES.FEED, Icon: FeedIcon, guestAllowed: true },
  { label: "Добавление", route: ROUTES.DRAFT, Icon: AddIcon, guestAllowed: false },
  { label: "Плитка", route: ROUTES.CATALOG, Icon: CatalogIcon, guestAllowed: true },
];

export const TabBar: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.chemistUser.isAuthenticated,
  );

  const isActive = (route: string): boolean =>
    route === ROUTES.CATALOG ? pathname === route : pathname.startsWith(route);

  /**
   * Деавторизация. Домен «Инженер-технолог» ходит в веб-сервис обычным
   * axios прямо из компонента, без thunk и без кодогенерации.
   */
  const handleLogout = async (): Promise<void> => {
    dispatch(chemistUserRequestStarted());

    try {
      await axios.post("/api/chemist_users/logout", null, {
        withCredentials: true,
      });
      dispatch(chemistUserLoggedOut());
    } catch {
      // Сессии на бэкенде уже нет — интерфейс всё равно возвращаем гостю
      dispatch(chemistUserLoggedOut());
      dispatch(chemistUserRequestFailed("Сессия уже завершена"));
    }

    // При выходе сбрасывается фильтр пользователя
    dispatch(materialFilterReset());
    navigate(ROUTES.CATALOG);
  };

  return (
    <nav className="bottom-navbar">
      {TAB_ITEMS.map(({ label, route, Icon, guestAllowed }) => {
        const available = guestAllowed || isAuthenticated;
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

      {isAuthenticated ? (
        <button type="button" className="nav-item" onClick={handleLogout}>
          <LogoutIcon active={false} />
          <span>Выход</span>
        </button>
      ) : (
        <Link
          to={ROUTES.LOGIN}
          className={`nav-item${isActive(ROUTES.LOGIN) ? " active" : ""}`}
        >
          <LoginIcon active={isActive(ROUTES.LOGIN)} />
          <span>Вход</span>
        </Link>
      )}
    </nav>
  );
};
