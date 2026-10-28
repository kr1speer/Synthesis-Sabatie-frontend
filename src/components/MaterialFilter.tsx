import type { ChangeEvent, FC } from "react";
import { Button, Form } from "react-bootstrap";

export interface MaterialFilterProps {
  value: number;
  appliedValue: number;
  maxValue: number;
  foundCount: number;
  onChange: (value: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export const MaterialFilter: FC<MaterialFilterProps> = ({
  value,
  appliedValue,
  maxValue,
  foundCount,
  onChange,
  onApply,
  onReset,
}) => {
  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(Number(event.target.value));
  };

  return (
    <Form
      className="filter-panel"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <Form.Label htmlFor="min-reaction-value" className="filter-label">
        Минимальное значение для типовой реакции, г
      </Form.Label>

      <p className="filter-status">
        {appliedValue > 0 ? (
          <>
            Показаны материалы от <strong>{appliedValue} г</strong>
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
        value={value}
        onChange={handleRangeChange}
      />

      <div className="filter-scale">
        <span>0 г</span>
        <span>{maxValue} г</span>
      </div>

      <div className="filter-actions">
        <Button type="submit" className="pill-btn">
          Применить
        </Button>
        <Button type="button" className="pill-btn" onClick={onReset}>
          Сбросить
        </Button>
      </div>

      <div className="section-head">
        <span className="tag-chip">Найдено: {foundCount}</span>
      </div>
    </Form>
  );
};
