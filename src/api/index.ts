import { Api } from "./Api";

// Экземпляр сгенерированного из Swagger клиента. Базовый адрес пустой:
// запросы уходят на собственный адрес фронтенда и попадают на бэкенд
// через прокси Vite (см. vite.config.ts).
//
// withCredentials обязателен: сессия хранится в куке session_id с флагом
// HttpOnly, прочитать её из JavaScript нельзя — браузер должен прикладывать
// её к запросу сам.
export const api = new Api({
  withCredentials: true,
});
