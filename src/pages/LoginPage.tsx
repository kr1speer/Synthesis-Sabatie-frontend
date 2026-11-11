import axios from "axios";
import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { ChemistUserOut } from "../api/Api";
import { AppLayout } from "../components/AppLayout";
import {
  chemistUserLoggedIn,
  chemistUserRequestFailed,
  chemistUserRequestStarted,
} from "../slices/chemistUserSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { ROUTES } from "../Routes";

/**
 * Страница аутентификации инженера-технолога.
 *
 * Домен «Инженер-технолог» ходит в веб-сервис обычным axios прямо из
 * компонента: ни thunk, ни сгенерированный из Swagger код здесь не нужны.
 * Компонент получает ответ и отправляет в store готовое действие, после
 * чего приложение переключается с интерфейса гостя на интерфейс
 * пользователя.
 *
 * Регистрации в приложении нет: по заданию страниц четыре, а в навигационной
 * панели переключается Вход/Выход. Метод регистрации остаётся методом
 * веб-сервиса и показывается в Postman.
 */
const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.chemistUser);

  const [formData, setFormData] = useState({
    chemist_login: "",
    chemist_password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLogin = async (): Promise<void> => {
    dispatch(chemistUserRequestStarted());

    try {
      // withCredentials обязателен: ответ приходит с Set-Cookie session_id
      const response = await axios.post<ChemistUserOut>(
        "/api/chemist_users/login",
        formData,
        { withCredentials: true },
      );

      dispatch(chemistUserLoggedIn(response.data));
      // Плитка перечитается сама: она следит за признаком аутентификации
      // и приходит уже с is_mine и is_liked этого пользователя
      navigate(ROUTES.CATALOG);
    } catch {
      dispatch(chemistUserRequestFailed("Неверный логин или пароль"));
    }
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();

    // Кнопку не блокируем: пустые поля объясняем сообщением, иначе
    // непонятно, почему на неё не нажимается
    if (!formData.chemist_login || !formData.chemist_password) {
      dispatch(chemistUserRequestFailed("Заполните логин и пароль"));
      return;
    }

    void handleLogin();
  };

  return (
    <AppLayout contentClassName="grid-padding">
      <h2 className="page-title">Вход в систему</h2>
      <p className="page-subtitle">
        Инженеру-технологу доступны лайки, добавление и удаление материалов
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="auth-form" onSubmit={handleSubmit}>
        <Form.Group controlId="chemist_login" className="auth-field">
          <Form.Label className="filter-label">Логин</Form.Label>
          <Form.Control
            type="text"
            name="chemist_login"
            value={formData.chemist_login}
            onChange={handleChange}
            placeholder="a.karpov"
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group controlId="chemist_password" className="auth-field">
          <Form.Label className="filter-label">Пароль</Form.Label>
          <Form.Control
            type="password"
            name="chemist_password"
            value={formData.chemist_password}
            onChange={handleChange}
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </Form.Group>

        <div className="filter-actions">
          <Button type="submit" className="pill-btn" disabled={loading}>
            Войти
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default LoginPage;
