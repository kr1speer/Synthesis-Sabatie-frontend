import { MATERIALS_MOCK } from "./mock";
import type { SabatierMaterial } from "./types";

const MOCK_DELAY_MS = 300;

function withDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}

export function getSabatierMaterials(
  minReactionValue: number,
): Promise<SabatierMaterial[]> {
  const materials = MATERIALS_MOCK.filter(
    (material) =>
      minReactionValue === 0 ||
      (material.min_reaction_value ?? 0) >= minReactionValue,
  );
  return withDelay(materials);
}

export function getSabatierMaterialFeed(
  materialId?: number,
): Promise<SabatierMaterial | null> {
  const material =
    materialId === undefined
      ? MATERIALS_MOCK[0]
      : MATERIALS_MOCK.find((item) => item.id === materialId);
  return withDelay(material ?? null);
}

export function getNextMaterialId(materialId: number): number {
  const index = MATERIALS_MOCK.findIndex((item) => item.id === materialId);
  const nextIndex = (index + 1) % MATERIALS_MOCK.length;
  return MATERIALS_MOCK[nextIndex].id;
}

export function getMaxReactionValue(): number {
  return MATERIALS_MOCK.reduce(
    (max, material) => Math.max(max, material.min_reaction_value ?? 0),
    0,
  );
}
