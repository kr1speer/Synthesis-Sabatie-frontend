import { useState, type FC } from "react";
import { Button } from "react-bootstrap";
import type { SabatierMaterialOut } from "../api/Api";
import {
  materialImageUrl,
  materialVideoUrl,
  mockMaterialVideoUrl,
  DEFAULT_MATERIAL_VIDEO,
} from "../modules/media";
import { LikeIcon } from "./LikeIcon";

export interface FeedMaterialProps {
  material: SabatierMaterialOut;
  isAuthenticated: boolean;
  onNext: () => void;
  onLike: (material: SabatierMaterialOut) => void;
}

const DESCRIPTION_LIMIT = 60;

export const FeedMaterial: FC<FeedMaterialProps> = ({
  material,
  isAuthenticated,
  onNext,
  onLike,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const description = material.material_description ?? "";
  const collapsible = description.length > DESCRIPTION_LIMIT;

  return (
    <div className="feed-viewport">
      {/* Источники перебираются сверху вниз: MinIO, копия из проекта
          для режима mock и, наконец, видео по умолчанию */}
      <video
        className="feed-video"
        poster={materialImageUrl(material.material_image_name)}
        autoPlay
        loop
        muted
        playsInline
        key={material.id}
      >
        <source
          src={materialVideoUrl(material.material_video_name)}
          type="video/mp4"
        />
        <source
          src={mockMaterialVideoUrl(material.material_video_name)}
          type="video/mp4"
        />
        <source src={DEFAULT_MATERIAL_VIDEO} type="video/mp4" />
      </video>

      <div className="feed-overlay-card">
        <h2 className="card-title">{material.material_name}</h2>
        <p className={`card-desc${descriptionOpen ? " open" : ""}`}>
          {description}
        </p>
        {collapsible && (
          <button
            type="button"
            className="desc-toggle-btn"
            onClick={() => setDescriptionOpen((open) => !open)}
          >
            <span className="desc-toggle-sign">
              {descriptionOpen ? "−" : "+"}
            </span>
            {descriptionOpen ? "Меньше" : "Больше"}
          </button>
        )}
      </div>

      <aside className="feed-params">
        <div className="param-chip">
          <span className="param-chip-label">Мин. для реакции, г</span>
          <span className="param-chip-value">
            {material.min_reaction_value ?? "—"}
          </span>
        </div>

        <div className="param-chip">
          <span className="param-chip-label">Молярная масса, г/моль</span>
          <span className="param-chip-value">{material.molar_mass ?? "—"}</span>
        </div>

        <button
          type="button"
          className="feed-like"
          disabled={!isAuthenticated}
          title={isAuthenticated ? "Лайк материала" : "Лайк доступен после входа"}
          onClick={() => onLike(material)}
        >
          <span
            className={`feed-like-icon${material.is_liked === 1 ? " liked" : ""}`}
          >
            <LikeIcon size={22} liked={material.is_liked === 1} />
          </span>
          <span className="like-count">{material.liked_count}</span>
        </button>

        <Button
          type="button"
          className="pill-btn pill-btn-light feed-next-btn"
          onClick={onNext}
        >
          Далее
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Button>
      </aside>
    </div>
  );
};
