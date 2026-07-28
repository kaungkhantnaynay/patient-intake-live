import type { PatientStatus } from "@/lib/intake/types";

type FormProgressProps = {
  completedFields: number;
  requiredFields: number;
  status: PatientStatus;
};

const statusLabels: Record<PatientStatus, string> = {
  inactive: "Inactive",
  active: "Actively filling",
  submitted: "Submitted",
};

export function FormProgress({
  completedFields,
  requiredFields,
  status,
}: FormProgressProps) {
  const progress =
    requiredFields === 0
      ? 0
      : Math.round((completedFields / requiredFields) * 100);

  return (
    <div className="rounded-lg border border-agnos-border bg-agnos-surface p-5 shadow-sm shadow-blue-950/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-agnos-muted">
            Required completion
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {progress}%
          </p>
        </div>
        <span className="rounded-full bg-agnos-cyan-soft px-3 py-1.5 text-sm font-semibold text-agnos-blue-dark">
          {statusLabels[status]}
        </span>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-agnos-cyan-soft"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-agnos-blue transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-agnos-muted">
        {completedFields} of {requiredFields} required fields complete.
      </p>
    </div>
  );
}
