import { useEffect, useState, type FC } from "react";
import { AppLayout } from "../components/AppLayout";
import { FeedMaterial } from "../components/FeedMaterial";
import { Loader } from "../components/Loader";
import {
  getNextMaterialId,
  getSabatierMaterialFeed,
} from "../modules/materialsApi";
import type { SabatierMaterial } from "../modules/types";

const FeedPage: FC = () => {
  const [material, setMaterial] = useState<SabatierMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);

  useEffect(() => {
    let actual = true;
    setLoading(true);

    getSabatierMaterialFeed(currentId).then((data) => {
      if (!actual) {
        return;
      }
      setMaterial(data);
      setLoading(false);
    });

    return () => {
      actual = false;
    };
  }, [currentId]);

  const handleNext = (): void => {
    if (material) {
      setCurrentId(getNextMaterialId(material.id));
    }
  };

  return (
    <AppLayout>
      {loading && <Loader />}
      {!loading && material && (
        <FeedMaterial material={material} onNext={handleNext} />
      )}
      {!loading && !material && (
        <p className="empty-state">Материал не найден</p>
      )}
    </AppLayout>
  );
};

export default FeedPage;
