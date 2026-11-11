import type { FC, MouseEvent } from "react";
import { Badge, Card } from "react-bootstrap";
import type { SabatierMaterialOut } from "../api/Api";
import { fallbackToDefaultImage, materialImageUrl } from "../modules/media";
import { LikeIcon } from "./LikeIcon";
import { TrashIcon } from "./TrashIcon";

export interface MaterialCardProps {
  material: SabatierMaterialOut;
  /** Лайк и удаление доступны только аутентифицированному пользователю */
  isAuthenticated: boolean;
  onOpen: (materialId: number) => void;
  onLike: (material: SabatierMaterialOut) => void;
  onDelete: (materialId: number) => void;
}

export const MaterialCard: FC<MaterialCardProps> = ({
  material,
  isAuthenticated,
  onOpen,
  onLike,
  onDelete,
}) => {
  // Кнопки лежат внутри карточки, а по карточке открывается лента —
  // всплытие события останавливаем
  const withoutOpening =
    (action: () => void) =>
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      action();
    };

  return (
    <Card className="grid-card" onClick={() => onOpen(material.id)}>
      <div className="grid-card-media">
        <Card.Img
          variant="top"
          className="grid-card-img"
          src={materialImageUrl(material.material_image_name)}
          alt={material.material_name}
          onError={(event) =>
            fallbackToDefaultImage(event, material.material_image_name)
          }
        />
        {material.min_reaction_value !== null && (
          <Badge className="card-top-badge" bg="">
            {material.min_reaction_value} г
          </Badge>
        )}

        {isAuthenticated && material.is_mine === 1 && (
          <button
            type="button"
            className="card-delete-btn"
            title="Удалить материал"
            onClick={withoutOpening(() => onDelete(material.id))}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <Card.Body className="grid-card-body">
        <Card.Title className="grid-card-title">
          {material.material_name}
        </Card.Title>

        <button
          type="button"
          className={`grid-card-likes${material.is_liked === 1 ? " liked" : ""}`}
          disabled={!isAuthenticated}
          title={
            isAuthenticated ? "Лайк материала" : "Лайк доступен после входа"
          }
          onClick={withoutOpening(() => onLike(material))}
        >
          <LikeIcon size={16} liked={material.is_liked === 1} />
          <span>{material.liked_count}</span>
        </button>
      </Card.Body>
    </Card>
  );
};
