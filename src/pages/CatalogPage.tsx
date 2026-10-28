import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Loader } from "../components/Loader";
import { MaterialCard } from "../components/MaterialCard";
import { MaterialFilter } from "../components/MaterialFilter";
import {
  getMaxReactionValue,
  getSabatierMaterials,
} from "../modules/materialsApi";
import type { SabatierMaterial } from "../modules/types";
import { materialRoute } from "../Routes";


const CatalogPage: FC = () => {
  const [materials, setMaterials] = useState<SabatierMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderValue, setSliderValue] = useState(0);
  const [appliedValue, setAppliedValue] = useState(0);

  const navigate = useNavigate();
  const maxReactionValue = getMaxReactionValue();


  useEffect(() => {
    let actual = true;
    setLoading(true);

    getSabatierMaterials(appliedValue).then((data) => {
      if (!actual) {
        return;
      }
      setMaterials(data);
      setLoading(false);
    });

    return () => {
      actual = false;
    };
  }, [appliedValue]);

  const handleApply = (): void => setAppliedValue(sliderValue);

  const handleReset = (): void => {
    setSliderValue(0);
    setAppliedValue(0);
  };

  const handleOpenMaterial = (materialId: number): void => {
    navigate(materialRoute(materialId));
  };

  return (
    <AppLayout contentClassName="grid-padding">
      <MaterialFilter
        value={sliderValue}
        appliedValue={appliedValue}
        maxValue={maxReactionValue}
        foundCount={materials.length}
        onChange={setSliderValue}
        onApply={handleApply}
        onReset={handleReset}
      />

      {loading && <Loader />}

      {!loading && materials.length > 0 && (
        <div className="cards-grid">
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              id={material.id}
              materialName={material.material_name}
              materialImageName={material.material_image_name}
              minReactionValue={material.min_reaction_value}
              likedCount={material.liked_count}
              onOpen={handleOpenMaterial}
            />
          ))}
        </div>
      )}

      {!loading && materials.length === 0 && (
        <p className="empty-state">Нет материалов с таким минимальным значением</p>
      )}
    </AppLayout>
  );
};

export default CatalogPage;
