export interface SabatierMaterial {
  id: number;
  material_name: string;
  material_description: string | null;
  material_image_name: string;
  material_video_name: string;
  min_reaction_value: number | null;
  molar_mass: number | null;
  liked_count: number;
}
