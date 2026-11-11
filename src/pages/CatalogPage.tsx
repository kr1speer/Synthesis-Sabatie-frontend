import { useEffect, type FC } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { SabatierMaterialOut } from "../api/Api";
import { AppLayout } from "../components/AppLayout";
import { MaterialCard } from "../components/MaterialCard";
import { MaterialFilter } from "../components/MaterialFilter";
import {
  deleteSabatierMaterial,
  getSabatierMaterials,
  likeSabatierMaterial,
} from "../slices/sabatierMaterialsSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { materialRoute } from "../Routes";

const CatalogPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { materials, loading, error } = useAppSelector(
    (state) => state.sabatierMaterials,
  );
  const isAuthenticated = useAppSelector(
    (state) => state.chemistUser.isAuthenticated,
  );

  // Запрос выполняется не здесь, а в middleware: компонент только
  // отправляет действие. Признак аутентификации в зависимостях — после
  // входа и выхода плитка перечитывается с новыми is_mine и is_liked
  useEffect(() => {
    dispatch(getSabatierMaterials());
  }, [dispatch, isAuthenticated]);

  const handleLike = (material: SabatierMaterialOut): void => {
    dispatch(
      likeSabatierMaterial({
        materialId: material.id,
        liked: material.is_liked === 1 ? 0 : 1,
      }),
    );
  };

  return (
    <AppLayout contentClassName="grid-padding">
      <MaterialFilter foundCount={materials.length} />

      {error && <Alert variant="warning">{error}</Alert>}

      {!loading && materials.length > 0 && (
        <div className="cards-grid">
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              isAuthenticated={isAuthenticated}
              onOpen={(materialId) => navigate(materialRoute(materialId))}
              onLike={handleLike}
              onDelete={(materialId) =>
                dispatch(deleteSabatierMaterial(materialId))
              }
            />
          ))}
        </div>
      )}

      {!loading && materials.length === 0 && !error && (
        <p className="empty-state">
          Нет материалов с таким минимальным значением
        </p>
      )}
    </AppLayout>
  );
};

export default CatalogPage;
