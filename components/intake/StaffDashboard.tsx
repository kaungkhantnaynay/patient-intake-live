"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PatientStatusBadge } from "./PatientStatusBadge";
import {
  emptyPatientIntake,
  intakeFields,
  intakeSections,
} from "@/lib/intake/schema";
import {
  createIntakeRealtimeConnection,
  getTransientIntakeSnapshot,
} from "@/lib/intake/realtime";
import type {
  IntakeConnectionState,
  IntakeFieldDefinition,
  IntakeRealtimeEvent,
  IntakeRealtimeTransport,
  PatientIntake,
  PatientIntakeField,
  PatientStatus,
} from "@/lib/intake/types";

type StaffSnapshot = {
  data: PatientIntake;
  status: PatientStatus;
  updatedAt: string | null;
  updatedField: PatientIntakeField | null;
};

const dashboardPanelClassName =
  "rounded-lg border border-agnos-border bg-agnos-surface p-5 shadow-sm shadow-blue-950/5";

function getDisplayValue(field: IntakeFieldDefinition, data: PatientIntake) {
  const value = data[field.name].trim();

  if (!value) {
    return "Awaiting input";
  }

  return value;
}

function getConnectionLabel(
  connectionState: IntakeConnectionState,
  transport: IntakeRealtimeTransport,
) {
  if (connectionState === "connected") {
    return transport === "supabase"
      ? "Live updates connected"
      : "Local demo connected";
  }

  if (connectionState === "connecting") {
    return transport === "supabase"
      ? "Connecting to Supabase"
      : "Starting local demo";
  }

  return transport === "supabase"
    ? "Realtime connection unavailable"
    : "Local sync unavailable";
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) {
    return "No updates yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(updatedAt));
}

export function StaffDashboard() {
  const [connectionState, setConnectionState] =
    useState<IntakeConnectionState>("connecting");
  const [transport, setTransport] =
    useState<IntakeRealtimeTransport>("local");
  const [snapshot, setSnapshot] = useState<StaffSnapshot>(() => {
    const transientSnapshot = getTransientIntakeSnapshot();

    return {
      data: transientSnapshot?.data ?? emptyPatientIntake,
      status: transientSnapshot?.status ?? "inactive",
      updatedAt: transientSnapshot?.updatedAt ?? null,
      updatedField: null,
    };
  });
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function receiveEvent(event: IntakeRealtimeEvent) {
      setSnapshot((currentSnapshot) => {
        if (
          currentSnapshot.updatedAt &&
          Date.parse(event.updatedAt) < Date.parse(currentSnapshot.updatedAt)
        ) {
          return currentSnapshot;
        }

        if (event.type === "field:update") {
          if (highlightTimerRef.current) {
            clearTimeout(highlightTimerRef.current);
          }

          highlightTimerRef.current = setTimeout(() => {
            setSnapshot((latestSnapshot) => ({
              ...latestSnapshot,
              updatedField: null,
            }));
            highlightTimerRef.current = null;
          }, 1_200);

          return {
            ...currentSnapshot,
            data: {
              ...currentSnapshot.data,
              [event.field]: event.value,
            },
            updatedAt: event.updatedAt,
            updatedField: event.field,
          };
        }

        if (event.type === "status:update") {
          return {
            ...currentSnapshot,
            status: event.status,
            updatedAt: event.updatedAt,
          };
        }

        return {
          data: event.data,
          status: event.status,
          updatedAt: event.updatedAt,
          updatedField: null,
        };
      });
    }

    const connection = createIntakeRealtimeConnection({
      onConnectionChange: (nextState, nextTransport) => {
        setConnectionState(nextState);
        setTransport(nextTransport);

        if (nextState === "connected") {
          void connection.requestSnapshot();
        }
      },
      onEvent: receiveEvent,
    });

    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }

      connection.disconnect();
    };
  }, []);

  const hasPatientActivity = useMemo(
    () => Object.values(snapshot.data).some((value) => value.trim()),
    [snapshot.data],
  );
  const completedFields = useMemo(
    () => Object.values(snapshot.data).filter((value) => value.trim()).length,
    [snapshot.data],
  );

  return (
    <div className="mt-8 space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className={dashboardPanelClassName}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
                Patient status
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Live intake feed</h2>
              <p className="mt-3 max-w-2xl leading-7 text-agnos-muted">
                Watch patient activity and field completion as updates arrive.
                Empty fields stay muted so changes are easy to scan.
              </p>
            </div>
            <PatientStatusBadge status={snapshot.status} />
          </div>
        </div>

        <div className={dashboardPanelClassName}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
                Connection
              </p>
              <p className="mt-2 text-lg font-semibold" aria-live="polite">
                {getConnectionLabel(connectionState, transport)}
              </p>
              <p className="mt-3 text-sm leading-6 text-agnos-muted">
                Last updated:{" "}
                <span className="font-semibold text-foreground">
                  {formatUpdatedAt(snapshot.updatedAt)}
                </span>
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-agnos-muted">
                Fields received
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {completedFields}
                <span className="text-base text-agnos-muted">
                  /{intakeFields.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {!hasPatientActivity ? (
        <section className="rounded-lg border border-dashed border-agnos-cyan/70 bg-agnos-cyan-soft p-5">
          <h2 className="text-lg font-semibold">No patient activity yet</h2>
          <p className="mt-2 max-w-3xl leading-7 text-agnos-muted">
            When the patient begins entering details, this area will show the
            latest values and highlight the most recently updated field.
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {Object.entries(intakeSections).map(([section, title]) => {
          const fields = intakeFields.filter(
            (field) => field.section === section,
          );

          return (
            <div key={section} className={dashboardPanelClassName}>
              <h2 className="text-lg font-semibold">{title}</h2>
              <dl className="mt-4 divide-y divide-agnos-border">
                {fields.map((field) => {
                  const isUpdatedField = snapshot.updatedField === field.name;
                  const value = getDisplayValue(field, snapshot.data);

                  return (
                    <div
                      key={field.name}
                      className={`-mx-3 grid gap-2 rounded-md px-3 py-3 transition-colors duration-200 ease-[var(--ease-out)] first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] ${
                        isUpdatedField
                          ? "bg-agnos-cyan-soft"
                          : "bg-transparent"
                      }`}
                    >
                      <dt className="text-sm font-medium text-agnos-muted">
                        {field.label}
                      </dt>
                      <dd
                        className={`text-sm font-semibold ${
                          value === "Awaiting input"
                            ? "text-agnos-muted/60"
                            : "text-foreground"
                        }`}
                      >
                        {value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </section>
    </div>
  );
}
