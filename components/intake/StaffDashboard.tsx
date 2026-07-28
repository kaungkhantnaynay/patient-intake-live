"use client";

import { useMemo, useState } from "react";
import { PatientStatusBadge } from "./PatientStatusBadge";
import {
  emptyPatientIntake,
  intakeFields,
  intakeSections,
} from "@/lib/intake/schema";
import type {
  IntakeFieldDefinition,
  PatientIntake,
  PatientIntakeField,
  PatientStatus,
} from "@/lib/intake/types";

type ConnectionState = "waiting" | "connected" | "disconnected";

type StaffSnapshot = {
  data: PatientIntake;
  status: PatientStatus;
  lastUpdatedAt: string | null;
  updatedField: PatientIntakeField | null;
};

const connectionLabels: Record<ConnectionState, string> = {
  waiting: "Waiting for patient activity",
  connected: "Live connection ready",
  disconnected: "Realtime connection unavailable",
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

export function StaffDashboard() {
  const [connectionState] = useState<ConnectionState>("waiting");
  const [snapshot] = useState<StaffSnapshot>({
    data: emptyPatientIntake,
    status: "inactive",
    lastUpdatedAt: null,
    updatedField: null,
  });

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
              <p className="mt-2 text-lg font-semibold">
                {connectionLabels[connectionState]}
              </p>
              <p className="mt-3 text-sm leading-6 text-agnos-muted">
                Last updated:{" "}
                <span className="font-semibold text-foreground">
                  {snapshot.lastUpdatedAt ?? "No updates yet"}
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
                      className={`grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] ${
                        isUpdatedField
                          ? "rounded-md bg-agnos-cyan-soft px-3 transition-colors duration-200 ease-[var(--ease-out)]"
                          : ""
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
