import type { SabatierMaterial } from "./types";

export const MATERIALS_MOCK: SabatierMaterial[] = [
  {
    id: 1,
    material_name: "Водород H₂",
    material_description:
      "Восстановитель в реакции Сабатье: на 1 моль метана расходуется 4 моль водорода. " +
      "Для получения 1 кг CH₄ (62,3 моль) требуется 249 моль H₂ — около 503 г. " +
      "Получается электролизом воды.",
    material_image_name: "hydrogen.jpeg",
    material_video_name: "hydrogen.mp4",
    min_reaction_value: 503,
    molar_mass: 2.016,
    liked_count: 10,
  },
  {
    id: 2,
    material_name: "Углекислый газ CO₂",
    material_description:
      "Источник углерода для метанирования. На 1 моль метана нужен 1 моль CO₂, " +
      "поэтому для 1 кг CH₄ требуется 62,3 моль — 2744 г. Улавливается из дымовых " +
      "газов электростанций и цементных заводов.",
    material_image_name: "carbon_dioxide.jpeg",
    material_video_name: "carbon_dioxide.mp4",
    min_reaction_value: 2744,
    molar_mass: 44.01,
    liked_count: 6,
  },
  {
    id: 3,
    material_name: "Вода H₂O",
    material_description:
      "Сырьё для получения водорода электролизом: 2H₂O → 2H₂ + O₂. Из 1 моль воды " +
      "получается 1 моль H₂, поэтому для 249 моль водорода на 1 кг метана нужно " +
      "около 4493 г воды. Используется деионизированная вода.",
    material_image_name: "water.jpeg",
    material_video_name: "water.mp4",
    min_reaction_value: 4493,
    molar_mass: 18.015,
    liked_count: 8,
  },
  {
    id: 4,
    material_name: "Биогаз CH₄ + CO₂",
    material_description:
      "Смесь 60% метана и 40% углекислого газа со средней молярной массой 27,2 г/моль. " +
      "CO₂ из биогаза превращается в метан прямо в смеси. Чтобы получить 62,3 моль CO₂ " +
      "на 1 кг CH₄, нужно около 4244 г биогаза.",
    material_image_name: "biogas.png",
    material_video_name: "biogas.mp4",
    min_reaction_value: 4244,
    molar_mass: 27.23,
    liked_count: 3,
  },
  {
    id: 5,
    material_name: "Катализатор Ni/Al₂O₃",
    material_description:
      "Никель на оксиде алюминия — самый распространённый катализатор метанирования. " +
      "Работает при 250–400 °C и не расходуется в реакции. Для потока газа 7 м³/ч, " +
      "дающего 1 кг метана в час, в реактор загружают около 250 г катализатора.",
    material_image_name: "",
    material_video_name: "",
    min_reaction_value: 250,
    molar_mass: 58.69,
    liked_count: 7,
  },
];
