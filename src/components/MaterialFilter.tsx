import type { ChangeEvent, FC } from "react";
import { Button, Form } from "react-bootstrap";
import {
  getSabatierMaterials,
  materialFilterApplied,
  materialFilterReset,
  minReactionValueChanged,
  selectMaxReactionValue,
} from "../slices/sabatierMaterialsSlice";
import { useAppDispatch, useAppSelector } from "../store";

export interface MaterialFilterProps {
  foundCount: number;
}

/**
 * Фильтр по минимальному значению для типовой реакции.
 *
 * Значение ползунка и применённое значение лежат в store, поэтому фильтр
 * не теряется при переходе на ленту и обратно. Отбор выполняет бэкенд:
 * значение уходит в запрос как query-параметр.
 */
export const MaterialFilter: FC<MaterialFilterProps> = ({ foundCount }) => {
  const dispatch = useAppDispatch();

  const { minReactionValue, appliedReactionValue, loading } = useAppSelector(
    (state) => state.sabatierMaterials,
  );
  const maxValue = useAppSelector(selectMaxReactionValue);

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(minReactionValueChanged(Number(event.target.value)));
  };

  const handleApply = (): void => {
    dispatch(materialFilterApplied());
    dispatch(getSabatierMaterials());
  };

  const handleReset = (): void => {
    dispatch(materialFilterReset());
    dispatch(getSabatierMaterials());
  };

  return (
    <Form
      className="filter-panel"
      onSubmit={(event) => {
        event.preventDefault();
        handleApply();
      }}
    >
      <Form.Label htmlFor="min-reaction-value" className="filter-label">
        Минимальное значение для типовой реакции, г
      </Form.Label>

      <p className="filter-status">
        {appliedReactionValue > 0 ? (
          <>
            Показаны материалы от <strong>{appliedReactionValue} г</strong>
          </>
        ) : (
          "Показаны все материалы"
        )}
      </p>

      <Form.Range
        id="min-reaction-value"
        className="filter-range"
        min={0}
        max={maxValue}
        step={1}
        value={minReactionValue}
        onChange={handleRangeChange}
      />

      <div className="filter-scale">
        <span>0 г</span>
        <span>{maxValue} г</span>
      </div>

      <div className="filter-actions">
        <Button type="submit" className="pill-btn" disabled={loading}>
          Применить
        </Button>
        <Button
          type="button"
          className="pill-btn"
          disabled={loading}
          onClick={handleReset}
        >
          Сбросить
        </Button>
      </div>

      <div className="section-head">
        <span className="tag-chip">Найдено: {foundCount}</span>
      </div>
    </Form>
  );
};
