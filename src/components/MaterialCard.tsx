import type { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { LikeIcon } from "./LikeIcon";
import { fallbackToDefaultImage, materialImageUrl } from "../modules/media";

/** Карточка материала на странице плитки.
 *
 *  Компонент ничего не знает ни о фильтре, ни о странице: всё, что он
 *  показывает, приходит в props, а по нажатию он лишь сообщает наверх
 *  идентификатор материала через onOpen. */
export interface MaterialCardProps {
  id: number;
  materialName: string;
  materialImageName: string;
  minReactionValue: number | null;
  likedCount: number;
  onOpen: (materialId: number) => void;
}

export const MaterialCard: FC<MaterialCardProps> = ({
  id,
  materialName,
  materialImageName,
  minReactionValue,
  likedCount,
  onOpen,
}) => (
  <Card className="grid-card" onClick={() => onOpen(id)}>
    <div className="grid-card-media">
      <Card.Img
        variant="top"
        className="grid-card-img"
        src={materialImageUrl(materialImageName)}
        alt={materialName}
        onError={fallbackToDefaultImage}
      />
      {minReactionValue !== null && (
        <Badge className="card-top-badge" bg="">
          {minReactionValue} г
        </Badge>
      )}
    </div>
    <Card.Body className="grid-card-body">
      <Card.Title className="grid-card-title">{materialName}</Card.Title>
      <div className="grid-card-likes">
        <LikeIcon size={16} />
        <span>{likedCount}</span>
      </div>
    </Card.Body>
  </Card>
);
