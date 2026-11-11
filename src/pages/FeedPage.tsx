import { useEffect, type FC } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import type { SabatierMaterialOut } from "../api/Api";
import { AppLayout } from "../components/AppLayout";
import { FeedMaterial } from "../components/FeedMaterial";
import {
  getSabatierMaterialFeed,
  likeSabatierMaterial,
} from "../slices/sabatierMaterialsSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { materialRoute } from "../Routes";

const FeedPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { feedMaterial, loading, error } = useAppSelector(
    (state) => state.sabatierMaterials,
  );
  const isAuthenticated = useAppSelector(
    (state) => state.chemistUser.isAuthenticated,
  );

  const routeMaterialId = id === undefined ? undefined : Number(id);

  useEffect(() => {
    // Материал уже в store — «Далее» положило его туда до смены адреса
    if (feedMaterial !== null && feedMaterial.id === routeMaterialId) {
      return;
    }
    dispatch(getSabatierMaterialFeed({ materialId: routeMaterialId }));
    // feedMaterial в зависимостях не нужен: эффект работает на смену адреса
  }, [dispatch, routeMaterialId]);

  /** Следующий материал ищет бэкенд: ид могут идти с пропусками. */
  const handleNext = async (): Promise<void> => {
    if (feedMaterial === null) {
      return;
    }

    const action = await dispatch(
      getSabatierMaterialFeed({ materialId: feedMaterial.id, next: true }),
    );
    const nextMaterial = (action.payload ?? null) as SabatierMaterialOut | null;

    if (nextMaterial !== null) {
      navigate(materialRoute(nextMaterial.id), { replace: true });
    }
  };

  const handleLike = (material: SabatierMaterialOut): void => {
    dispatch(
      likeSabatierMaterial({
        materialId: material.id,
        liked: material.is_liked === 1 ? 0 : 1,
      }),
    );
  };

  return (
    <AppLayout>
      {error && (
        <Alert variant="warning" className="feed-alert">
          {error}
        </Alert>
      )}

      {feedMaterial !== null && (
        <FeedMaterial
          material={feedMaterial}
          isAuthenticated={isAuthenticated}
          onNext={handleNext}
          onLike={handleLike}
        />
      )}

      {!loading && feedMaterial === null && !error && (
        <p className="empty-state">Материал не найден</p>
      )}
    </AppLayout>
  );
};

export default FeedPage;
