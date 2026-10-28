/** Адреса страниц приложения. */
export const ROUTES = {
  CATALOG: "/",
  FEED: "/feed",
  MATERIAL: "/feed",
  LOGIN: "/login",
  DRAFT: "/draft",
} as const;

export function materialRoute(materialId: number): string {
  return `${ROUTES.MATERIAL}/${materialId}`;
}
