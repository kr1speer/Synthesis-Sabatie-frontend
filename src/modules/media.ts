// Бэкенд хранит в БД только имена файлов, а сами объекты лежат в MinIO.
// Ссылку собирает фронтенд.
//
// Адрес хранилища не прямой: обращение к http://localhost:9000 — это смена
// источника, то есть снова CORS. Поэтому у Vite второй маршрут прокси, /s3,
// и ссылка остаётся ссылкой на свой же источник (vite.config.ts).
const MINIO_BUCKET_URL = "/s3/sabatie-assets";

// Медиа по умолчанию в MinIO нет — по требованию методички оба файла лежат
// в самом проекте React и отдаются сервером разработки.
export const DEFAULT_MATERIAL_IMAGE = "/default_material.png";
export const DEFAULT_MATERIAL_VIDEO = "/default_material.mp4";

const DEFAULT_IMAGE_NAME = "default_material.png";
const DEFAULT_VIDEO_NAME = "default_material.mp4";

// Копии материалов из коллекции mock-объектов: нужны, когда бэкенд
// не запущен и страницы работают на mock.
const MOCK_MEDIA_PATH = "/materials";

export function materialImageUrl(imageName: string): string {
  if (!imageName || imageName === DEFAULT_IMAGE_NAME) {
    return DEFAULT_MATERIAL_IMAGE;
  }
  return `${MINIO_BUCKET_URL}/${imageName}`;
}

export function materialVideoUrl(videoName: string): string {
  if (!videoName || videoName === DEFAULT_VIDEO_NAME) {
    return DEFAULT_MATERIAL_VIDEO;
  }
  return `${MINIO_BUCKET_URL}/${videoName}`;
}

export function mockMaterialImageUrl(imageName: string): string {
  if (!imageName || imageName === DEFAULT_IMAGE_NAME) {
    return DEFAULT_MATERIAL_IMAGE;
  }
  return `${MOCK_MEDIA_PATH}/${imageName}`;
}

export function mockMaterialVideoUrl(videoName: string): string {
  if (!videoName || videoName === DEFAULT_VIDEO_NAME) {
    return DEFAULT_MATERIAL_VIDEO;
  }
  return `${MOCK_MEDIA_PATH}/${videoName}`;
}

/**
 * Изображение не загрузилось: сначала пробуем копию из проекта (режим mock,
 * когда MinIO недоступен), затем изображение по умолчанию.
 */
export function fallbackToDefaultImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  imageName: string,
): void {
  const image = event.currentTarget;
  const mockUrl = mockMaterialImageUrl(imageName);

  if (!image.src.endsWith(mockUrl) && mockUrl !== DEFAULT_MATERIAL_IMAGE) {
    image.src = mockUrl;
    return;
  }

  image.onerror = null;
  image.src = DEFAULT_MATERIAL_IMAGE;
}
