# Synthesis-sabatier-frontend

Общий контекст курса: @~/.claude/sabatier-course.md

Фронтенд на React + TypeScript — ЛР5–8. Бэкенд лежит в соседнем репозитории
`~/Documents/Synthesis-Sabatie-backend`, он подключён через
`permissions.additionalDirectories` в `.claude/settings.json`.

## Методички здесь, в `methods/`

Материалы разделены по ответственности, дублей между репозиториями нет.
В этой папке — только фронтендовое:

| Файл | Что это |
|---|---|
| `method_lab5.md`, `method_lab6.md`, `method_lab7.md` | задания и «Порядок показа» |
| `React.md` | большая методичка по React |
| `Lecture_8_React_Introduction.pdf` | лекция |
| `UI/` | вёрстка ЛР1 на Jinja2 — основа страниц React |
| `assets_demo/image*.png` | скриншоты эталонного интерфейса |

Основа вёрстки: `UI/static/css/style.css` — палитра Air Liquide
(`--identity-primary: #00349b`), мобильный контейнер 390×844;
`UI/templates/` — три страницы: плитка, лента, добавление;
`UI/static/img/` — иконки навбара и медиа по умолчанию.

## Что смотреть в бэкенде

| Что нужно | Файл в бэкенде |
|---|---|
| Поля и типы JSON — для типов TypeScript | `api/sabatier_schemas.py` |
| URL, query-параметры, коды ответов | `api/sabatier_material_handlers.py` |
| Регистрация, вход, выход | `api/chemist_user_handlers.py` |
| Кука сессии, гость против создателя | `api/chemist_user_auth.py`, `data/sabatier_redis.py` |
| Данные для mock-объектов ЛР5 | `sql/02_seed_data.sql` |
| Общие требования курса, типовые ошибки | `methods/all_requirements.md`, `methods/typical_mistakes.md` |
| Замечания преподавателя | `methods/my_person_requirements_for_update.md` |
| ГОСТ, образец РПЗ, диаграммы | `methods/ГОСТ_к_РПЗ.pdf`, `methods/edit.drawio` |

Swagger живого сервиса — `http://127.0.0.1:8000/docs`, спецификация для
кодогенерации axios в ЛР6 — `http://127.0.0.1:8000/openapi.json`.

## Стыковка с бэкендом

Бэкенд отдаёт **имена файлов**, а не URL: `material_image_name`,
`material_video_name`. Ссылку собирает фронтенд — объекты лежат в MinIO,
бакет `sabatie-assets` на порту 9000.

Медиа по умолчанию `default_material.png` и `default_material.mp4`
в MinIO отсутствуют. В ЛР5 они должны лежать в самом проекте React
(требование методички), оригиналы — в `methods/UI/static/img/`.

Аутентификация — кука `session_id`, `HttpOnly`. Значит, axios обязан
слать запросы с `withCredentials`, а CORS в ЛР6 решается проксированием
в Vite, а не заголовками.
