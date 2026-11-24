import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import {
  createSabatierMaterial,
  deleteSabatierMaterialDraft,
  getSabatierMaterialDraft,
  publishSabatierMaterial,
} from "../slices/materialDraftSlice";
import { useAppDispatch, useAppSelector } from "../store";
import {
  DEFAULT_MATERIAL_IMAGE,
  DEFAULT_MATERIAL_VIDEO,
  fallbackToDefaultImage,
  materialImageUrl,
} from "../modules/media";
import { ROUTES } from "../Routes";

const DraftPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { draftMaterial, loading, error } = useAppSelector(
    (state) => state.materialDraft,
  );
  const isAuthenticated = useAppSelector(
    (state) => state.chemistUser.isAuthenticated,
  );

  const [materialName, setMaterialName] = useState("");
  const [materialImage, setMaterialImage] = useState<File | null>(null);
  const [materialVideo, setMaterialVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [publishForm, setPublishForm] = useState({
    material_description: "",
    min_reaction_value: "",
    molar_mass: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }
    dispatch(getSabatierMaterialDraft());
  }, [dispatch, navigate, isAuthenticated]);

  useEffect(() => {
    return () => {
      if (imagePreview !== null) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (videoPreview !== null) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;
    setMaterialImage(file);
    setImagePreview(file === null ? null : URL.createObjectURL(file));
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;
    setMaterialVideo(file);
    setVideoPreview(file === null ? null : URL.createObjectURL(file));
  };

  const handlePublishFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setPublishForm({ ...publishForm, [event.target.name]: event.target.value });
  };

  const handleCreate = (event: FormEvent): void => {
    event.preventDefault();
    dispatch(createSabatierMaterial({ materialName, materialImage, materialVideo }));
  };

  const handlePublish = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (draftMaterial === null) {
      return;
    }

    const action = await dispatch(
      publishSabatierMaterial({
        materialId: draftMaterial.id,
        materialDescription: publishForm.material_description,
        minReactionValue: Number(publishForm.min_reaction_value),
        molarMass: Number(publishForm.molar_mass),
      }),
    );

    if (publishSabatierMaterial.fulfilled.match(action)) {
      resetForms();
      navigate(ROUTES.CATALOG);
    }
  };

  const handleDelete = (): void => {
    if (draftMaterial === null) {
      return;
    }
    dispatch(deleteSabatierMaterialDraft(draftMaterial.id)).then(resetForms);
  };

  function resetForms(): void {
    setMaterialName("");
    setMaterialImage(null);
    setMaterialVideo(null);
    setImagePreview(null);
    setVideoPreview(null);
    setPublishForm({
      material_description: "",
      min_reaction_value: "",
      molar_mass: "",
    });
  }

  const publishDisabled =
    loading ||
    !publishForm.material_description ||
    !publishForm.min_reaction_value ||
    !publishForm.molar_mass;

  return (
    <AppLayout contentClassName="grid-padding">
      <h2 className="page-title">Добавление материала</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {draftMaterial === null ? (
        <Form className="auth-form" onSubmit={handleCreate}>
          <p className="page-subtitle">
            Шаг 1. Название и медиа материала
          </p>

          <Form.Group controlId="material_name" className="auth-field">
            <Form.Label className="filter-label">Название материала</Form.Label>
            <Form.Control
              type="text"
              value={materialName}
              onChange={(event) => setMaterialName(event.target.value)}
              placeholder="Катализатор Ni/Al₂O₃"
            />
          </Form.Group>

          <Form.Group controlId="material_image" className="media-field">
            <div className="media-info">
              <Form.Label className="filter-label">Изображение</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {materialImage !== null && (
                <Form.Text className="draft-file-name">
                  {materialImage.name}
                </Form.Text>
              )}
            </div>
            <img
              className="media-preview"
              src={imagePreview ?? DEFAULT_MATERIAL_IMAGE}
              alt="Изображение материала"
            />
          </Form.Group>

          <Form.Group controlId="material_video" className="media-field">
            <div className="media-info">
              <Form.Label className="filter-label">Короткое видео</Form.Label>
              <Form.Control
                type="file"
                accept="video/mp4"
                onChange={handleVideoChange}
              />
              {materialVideo !== null && (
                <Form.Text className="draft-file-name">
                  {materialVideo.name}
                </Form.Text>
              )}
            </div>
            <video
              key={videoPreview ?? DEFAULT_MATERIAL_VIDEO}
              className="media-preview"
              src={videoPreview ?? DEFAULT_MATERIAL_VIDEO}
              autoPlay
              loop
              muted
              playsInline
            />
          </Form.Group>

          <div className="filter-actions">
            <Button
              type="submit"
              className="pill-btn"
              disabled={loading || !materialName}
            >
              Далее
            </Button>
          </div>
        </Form>
      ) : (
        <Form className="auth-form" onSubmit={handlePublish}>
          <p className="page-subtitle">
            Шаг 2. Описание и поля по предметной области
          </p>

          <div className="draft-card">
            <img
              className="draft-preview"
              src={materialImageUrl(draftMaterial.material_image_name)}
              alt={draftMaterial.material_name}
              onError={(event) =>
                fallbackToDefaultImage(event, draftMaterial.material_image_name)
              }
            />
            <span className="draft-name">{draftMaterial.material_name}</span>
          </div>

          <Form.Group controlId="material_description" className="auth-field">
            <Form.Label className="filter-label">Краткое описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="material_description"
              value={publishForm.material_description}
              onChange={handlePublishFieldChange}
              placeholder="Для чего материал нужен в реакции Сабатье"
            />
          </Form.Group>

          <Form.Group controlId="min_reaction_value" className="auth-field">
            <Form.Label className="filter-label">
              Минимальное значение для типовой реакции, г
            </Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="min_reaction_value"
              value={publishForm.min_reaction_value}
              onChange={handlePublishFieldChange}
              placeholder="250"
            />
          </Form.Group>

          <Form.Group controlId="molar_mass" className="auth-field">
            <Form.Label className="filter-label">
              Молярная масса, г/моль
            </Form.Label>
            <Form.Control
              type="number"
              min={0}
              step="0.001"
              name="molar_mass"
              value={publishForm.molar_mass}
              onChange={handlePublishFieldChange}
              placeholder="58.69"
            />
          </Form.Group>

          <div className="filter-actions">
            <Button type="submit" className="pill-btn" disabled={publishDisabled}>
              Опубликовать
            </Button>
            <Button
              type="button"
              className="pill-btn"
              disabled={loading}
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </div>
        </Form>
      )}
    </AppLayout>
  );
};

export default DraftPage;
