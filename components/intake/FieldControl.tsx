import type { ChangeEventHandler, FocusEventHandler } from "react";
import type { IntakeFieldDefinition } from "@/lib/intake/types";

type FieldControlProps = {
  field: IntakeFieldDefinition;
  value: string;
  error?: string;
  touched: boolean;
  onBlur: FocusEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  onChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
};

const inputClassName =
  "mt-2 w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-agnos-muted/70 focus:ring-2 focus:ring-agnos-blue/30";

export function FieldControl({
  field,
  value,
  error,
  touched,
  onBlur,
  onChange,
}: FieldControlProps) {
  const inputId = `intake-${field.name}`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(touched && error);
  const controlClassName = `${inputClassName} ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-agnos-border focus:border-agnos-blue"
  }`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-semibold">
          {field.label}
        </label>
        <span className="text-xs font-semibold text-agnos-muted">
          {field.required ? "Required" : "Optional"}
        </span>
      </div>

      {field.kind === "textarea" ? (
        <textarea
          id={inputId}
          name={field.name}
          value={value}
          rows={4}
          required={field.required}
          placeholder={field.placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onBlur={onBlur}
          onChange={onChange}
          className={`${controlClassName} resize-y`}
        />
      ) : field.kind === "select" ? (
        <select
          id={inputId}
          name={field.name}
          value={value}
          required={field.required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onBlur={onBlur}
          onChange={onChange}
          className={controlClassName}
        >
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          name={field.name}
          type={field.kind}
          value={value}
          required={field.required}
          placeholder={field.placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onBlur={onBlur}
          onChange={onChange}
          className={controlClassName}
        />
      )}

      {hasError ? (
        <p id={errorId} className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
