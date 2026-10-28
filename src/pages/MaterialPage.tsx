import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { FeedMaterial } from "../components/FeedMaterial";
import { Loader } from "../components/Loader";
import {
  getNextMaterialId,
  getSabatierMaterialFeed,
} from "../modules/materialsApi";
import type { SabatierMaterial } from "../modules/types";
import { materialRoute } from "../Routes";

const MaterialPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [material, setMaterial] = useState<SabatierMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let actual = true;
    setLoading(true);

    getSabatierMaterialFeed(Number(id)).then((data) => {
      if (!actual) {
        return;
      }
      setMaterial(data);
      setLoading(false);
    });

    return () => {
      actual = false;
    };
  }, [id]);

  const handleNext = (): void => {
    if (material) {
      navigate(materialRoute(getNextMaterialId(material.id)));
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

export default MaterialPage;
