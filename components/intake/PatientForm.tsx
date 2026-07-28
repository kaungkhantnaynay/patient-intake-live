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
  parsePatientIntake,
  validateIntakeField,
  validatePatientIntake,
} from "@/lib/intake/validation";
import {
  createIntakeRealtimeConnection,
  type IntakeRealtimeConnection,
} from "@/lib/intake/realtime";
import type {
  IntakeConnectionState,
  IntakeRealtimeEvent,
  IntakeRealtimeTransport,
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
  const [connectionState, setConnectionState] =
    useState<IntakeConnectionState>("connecting");
  const [transport, setTransport] =
    useState<IntakeRealtimeTransport>("local");
  const dataRef = useRef<PatientIntake>(emptyPatientIntake);
  const statusRef = useRef<PatientStatus>("inactive");
  const submittedSnapshotRef = useRef<PatientIntake | null>(null);
  const realtimeRef = useRef<IntakeRealtimeConnection | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const completedRequiredFields = useMemo(
    () =>
      requiredIntakeFields.filter((field) => data[field.name].trim()).length,
    [data],
  );

  useEffect(() => {
    function publishCurrentSnapshot() {
      const snapshotData =
        statusRef.current === "submitted" &&
        submittedSnapshotRef.current
          ? submittedSnapshotRef.current
          : dataRef.current;
      const snapshot: IntakeRealtimeEvent = {
        type: "form:replace",
        data: snapshotData,
        status: statusRef.current,
        updatedAt: new Date().toISOString(),
      };

      void realtimeRef.current?.publish(snapshot);
    }

    const connection = createIntakeRealtimeConnection({
      onConnectionChange: (nextState, nextTransport) => {
        setConnectionState(nextState);
        setTransport(nextTransport);

        if (nextState === "connected") {
          publishCurrentSnapshot();
        }
      },
      onEvent: () => undefined,
      onSnapshotRequest: publishCurrentSnapshot,
    });

    realtimeRef.current = connection;

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      connection.disconnect();
      realtimeRef.current = null;
    };
  }, []);

  function publish(event: IntakeRealtimeEvent) {
    void realtimeRef.current?.publish(event);
  }

  function updateStatus(nextStatus: PatientStatus) {
    if (statusRef.current === nextStatus) {
      return;
    }

    statusRef.current = nextStatus;
    setStatus(nextStatus);
    publish({
      type: "status:update",
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
  }

  function markActive() {
    updateStatus("active");

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      updateStatus("inactive");
      idleTimerRef.current = null;
    }, idleTimeoutMs);
  }

  function handleFieldChange(field: PatientIntakeField, value: string) {
    const startsNewIntake = statusRef.current === "submitted";

    markActive();
    setSubmittedAt(null);
    const nextData = {
      ...dataRef.current,
      [field]: value,
    };

    dataRef.current = nextData;
    setData(nextData);

    if (startsNewIntake) {
      submittedSnapshotRef.current = null;
      publish({
        type: "form:replace",
        data: nextData,
        status: "active",
        updatedAt: new Date().toISOString(),
      });
    } else {
      publish({
        type: "field:update",
        field,
        value,
        updatedAt: new Date().toISOString(),
      });
    }

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

    const validatedData = parsePatientIntake(data);

    if (!validatedData) {
      markActive();
      setSubmittedAt(null);
      return;
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    const submissionTime = new Date();
    const clearedData = { ...emptyPatientIntake };

    statusRef.current = "submitted";
    submittedSnapshotRef.current = validatedData;
    setStatus("submitted");
    publish({
      type: "form:replace",
      data: validatedData,
      status: "submitted",
      updatedAt: submissionTime.toISOString(),
    });
    dataRef.current = clearedData;
    setData(clearedData);
    setErrors({});
    setTouched({});
    setSubmittedAt(submissionTime.toLocaleString());
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <FormProgress
        completedFields={completedRequiredFields}
        connectionState={connectionState}
        requiredFields={requiredIntakeFields.length}
        status={status}
        transport={transport}
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
            : "We check your responses for completeness before you submit."}
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
