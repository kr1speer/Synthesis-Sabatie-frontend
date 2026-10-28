export const DEFAULT_MATERIAL_IMAGE = "/default_material.png";
export const DEFAULT_MATERIAL_VIDEO = "/default_material.mp4";

const MATERIALS_PATH = "/materials";

export function materialImageUrl(imageName: string): string {
  return imageName ? `${MATERIALS_PATH}/${imageName}` : DEFAULT_MATERIAL_IMAGE;
}

export function materialVideoUrl(videoName: string): string {
  return videoName ? `${MATERIALS_PATH}/${videoName}` : DEFAULT_MATERIAL_VIDEO;
}


export function fallbackToDefaultImage(
  event: React.SyntheticEvent<HTMLImageElement>,
): void {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = DEFAULT_MATERIAL_IMAGE;
}
