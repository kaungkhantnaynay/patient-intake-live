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

  return (
    <div className="mt-8 space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm shadow-blue-950/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-cyan">
                Patient status
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Live intake feed</h2>
              <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                The staff dashboard is ready to receive patient updates. Phase 4
                will connect these fields to Supabase Realtime Broadcast.
              </p>
            </div>
            <PatientStatusBadge status={snapshot.status} />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm shadow-blue-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-cyan">
            Connection
          </p>
          <p className="mt-2 text-lg font-semibold">
            {connectionLabels[connectionState]}
          </p>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            Last updated:{" "}
            <span className="font-semibold text-white">
              {snapshot.lastUpdatedAt ?? "No updates yet"}
            </span>
          </p>
        </div>
      </section>

      {!hasPatientActivity ? (
        <section className="rounded-lg border border-dashed border-agnos-cyan/40 bg-agnos-cyan/10 p-5">
          <h2 className="text-lg font-semibold">No patient activity yet</h2>
          <p className="mt-2 max-w-3xl leading-7 text-blue-100">
            Open the patient form when realtime is enabled to see values appear
            here as the patient fills out the intake fields.
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {Object.entries(intakeSections).map(([section, title]) => {
          const fields = intakeFields.filter(
            (field) => field.section === section,
          );

          return (
            <div
              key={section}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm shadow-blue-950/20"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <dl className="mt-4 divide-y divide-white/10">
                {fields.map((field) => {
                  const isUpdatedField = snapshot.updatedField === field.name;
                  const value = getDisplayValue(field, snapshot.data);

                  return (
                    <div
                      key={field.name}
                      className={`grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] ${
                        isUpdatedField
                          ? "rounded-md bg-agnos-cyan/10 px-3"
                          : ""
                      }`}
                    >
                      <dt className="text-sm font-medium text-blue-100">
                        {field.label}
                      </dt>
                      <dd
                        className={`text-sm font-semibold ${
                          value === "Awaiting input"
                            ? "text-blue-200/60"
                            : "text-white"
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
