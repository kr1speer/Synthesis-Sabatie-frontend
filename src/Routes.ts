export const ROUTES = {
  CATALOG: "/",
  FEED: "/feed",
  DRAFT: "/draft",
  LOGIN: "/login",
} as const;

export function materialRoute(materialId: number): string {
  return `${ROUTES.FEED}/${materialId}`;
}
