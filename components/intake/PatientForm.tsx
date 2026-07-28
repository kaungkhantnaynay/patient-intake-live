"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FieldControl } from "./FieldControl";
import { FormProgress } from "./FormProgress";
import {
  emptyPatientIntake,
  intakeFields,
  intakeSections,
  requiredIntakeFields,
} from "@/lib/intake/schema";
import {
  validateIntakeField,
  validatePatientIntake,
} from "@/lib/intake/validation";
import type {
  IntakeValidationErrors,
  PatientIntake,
  PatientIntakeField,
  PatientStatus,
} from "@/lib/intake/types";

type TouchedFields = Partial<Record<PatientIntakeField, boolean>>;

const idleTimeoutMs = 25_000;

export function PatientForm() {
  const [data, setData] = useState<PatientIntake>(emptyPatientIntake);
  const [errors, setErrors] = useState<IntakeValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [status, setStatus] = useState<PatientStatus>("inactive");
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const completedRequiredFields = useMemo(
    () =>
      requiredIntakeFields.filter((field) => data[field.name].trim()).length,
    [data],
  );

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  function markActive() {
    setStatus((currentStatus) =>
      currentStatus === "submitted" ? currentStatus : "active",
    );

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      setStatus((currentStatus) =>
        currentStatus === "submitted" ? currentStatus : "inactive",
      );
    }, idleTimeoutMs);
  }

  function handleFieldChange(field: PatientIntakeField, value: string) {
    markActive();
    setSubmittedAt(null);
    setData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    if (touched[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateIntakeField(field, value),
      }));
    }
  }

  function handleFieldBlur(field: PatientIntakeField) {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [field]: true,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateIntakeField(field, data[field]),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validatePatientIntake(data);
    const allFieldsTouched = intakeFields.reduce<TouchedFields>(
      (currentTouched, field) => ({
        ...currentTouched,
        [field.name]: true,
      }),
      {},
    );

    setTouched(allFieldsTouched);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      markActive();
      setSubmittedAt(null);
      return;
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    setStatus("submitted");
    setSubmittedAt(new Date().toLocaleString());
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <FormProgress
        completedFields={completedRequiredFields}
        requiredFields={requiredIntakeFields.length}
        status={status}
      />

      {Object.entries(intakeSections).map(([section, title], index) => {
        const fields = intakeFields.filter(
          (field) => field.section === section,
        );

        return (
          <section
            key={section}
            className="rounded-lg border border-agnos-border bg-agnos-surface p-5 shadow-sm shadow-blue-950/5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-agnos-cyan-soft text-sm font-semibold text-agnos-blue-dark">
                {index + 1}
              </span>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.kind === "textarea" ? "md:col-span-2" : ""}
                >
                  <FieldControl
                    field={field}
                    value={data[field.name]}
                    error={errors[field.name]}
                    touched={Boolean(touched[field.name])}
                    onBlur={() => handleFieldBlur(field.name)}
                    onChange={(event) =>
                      handleFieldChange(field.name, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="flex flex-col gap-4 rounded-lg border border-agnos-border bg-agnos-surface p-5 shadow-sm shadow-blue-950/5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-agnos-muted" aria-live="polite">
          {submittedAt
            ? `Form submitted successfully at ${submittedAt}.`
            : "Your information is checked on this device before submission."}
        </p>
        <button
          type="submit"
          className="pressable inline-flex min-h-12 items-center justify-center rounded-lg bg-agnos-blue px-5 text-sm font-semibold text-white shadow-md shadow-blue-950/15 hover:bg-agnos-blue-dark focus:outline-none focus:ring-2 focus:ring-agnos-blue focus:ring-offset-2"
        >
          Submit Intake
        </button>
      </div>
    </form>
  );
}
