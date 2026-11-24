const MINIO_BUCKET_URL = "/s3/sabatie-assets";

const BASE_URL = import.meta.env.BASE_URL;

export const DEFAULT_MATERIAL_IMAGE = `${BASE_URL}default_material.png`;
export const DEFAULT_MATERIAL_VIDEO = `${BASE_URL}default_material.mp4`;

const DEFAULT_IMAGE_NAME = "default_material.png";
const DEFAULT_VIDEO_NAME = "default_material.mp4";

const MOCK_MEDIA_PATH = `${BASE_URL}materials`;

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
