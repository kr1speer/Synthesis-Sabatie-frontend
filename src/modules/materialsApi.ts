import { MATERIALS_MOCK } from "./mock";
import type { SabatierMaterial } from "./types";

/** Доступ к материалам реакции.
 *
 *  В ЛР5 веб-сервиса нет, поэтому источник один — коллекция mock-объектов.
 *  Функции сделаны асинхронными специально: обращение к ним построено так же,
 *  как потом будет построен вызов веб-сервиса, поэтому в ЛР6 меняется только
 *  тело функций, а страницы остаются прежними. */

/** Небольшая задержка, чтобы на странице было видно состояние загрузки. */
const MOCK_DELAY_MS = 300;

function withDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}

/** Список материалов с фильтрацией по минимальной массе для типовой реакции.
 *  Ноль означает «показать все». */
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

/** Один материал ленты по идентификатору. Без идентификатора — первый. */
export function getSabatierMaterialFeed(
  materialId?: number,
): Promise<SabatierMaterial | null> {
  const material =
    materialId === undefined
      ? MATERIALS_MOCK[0]
      : MATERIALS_MOCK.find((item) => item.id === materialId);
  return withDelay(material ?? null);
}

/** Идентификатор следующего материала ленты.
 *  За последним материалом лента возвращается к первому. */
export function getNextMaterialId(materialId: number): number {
  const index = MATERIALS_MOCK.findIndex((item) => item.id === materialId);
  const nextIndex = (index + 1) % MATERIALS_MOCK.length;
  return MATERIALS_MOCK[nextIndex].id;
}

/** Верхняя граница ползунка фильтра — самая большая масса в коллекции. */
export function getMaxReactionValue(): number {
  return MATERIALS_MOCK.reduce(
    (max, material) => Math.max(max, material.min_reaction_value ?? 0),
    0,
  );
}
