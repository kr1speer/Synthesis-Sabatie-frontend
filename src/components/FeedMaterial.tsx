import { useState, type FC } from "react";
import { Button } from "react-bootstrap";
import { LikeIcon } from "./LikeIcon";
import {
  DEFAULT_MATERIAL_VIDEO,
  materialImageUrl,
  materialVideoUrl,
} from "../modules/media";
import type { SabatierMaterial } from "../modules/types";

/** Один материал ленты поверх проигрываемого короткого видео.
 *
 *  Материал приходит в props целиком, а кнопка «Далее» только сообщает
 *  наверх о нажатии — какой материал показывать следующим, решает страница.
 *  Собственное состояние здесь одно: развёрнуто ли описание. */
export interface FeedMaterialProps {
  material: SabatierMaterial;
  onNext: () => void;
}

/** Описание длиннее этого числа знаков показывается свёрнутым. */
const DESCRIPTION_LIMIT = 60;

export const FeedMaterial: FC<FeedMaterialProps> = ({ material, onNext }) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const description = material.material_description ?? "";
  const collapsible = description.length > DESCRIPTION_LIMIT;

  return (
    <div className="feed-viewport">
      <video
        className="feed-video"
        poster={materialImageUrl(material.material_image_name)}
        autoPlay
        loop
        muted
        playsInline
        /** Ключ заставляет React пересоздать тег при смене материала,
         *  иначе браузер продолжит играть предыдущий ролик. */
        key={material.id}
      >
        <source
          src={materialVideoUrl(material.material_video_name)}
          type="video/mp4"
        />
        {/* Запасной источник: если файл с таким именем не открылся,
            браузер сам переходит к следующему <source> и играет ролик
            по умолчанию. Для пустого имени первый источник и так
            указывает на него, поэтому второй не нужен. */}
        {material.material_video_name && (
          <source src={DEFAULT_MATERIAL_VIDEO} type="video/mp4" />
        )}
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

        <div className="feed-like">
          <span className="feed-like-icon">
            <LikeIcon size={22} />
          </span>
          <span className="like-count">{material.liked_count}</span>
        </div>

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
