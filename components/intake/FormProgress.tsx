import type {
  IntakeConnectionState,
  IntakeRealtimeTransport,
  PatientStatus,
} from "@/lib/intake/types";

type FormProgressProps = {
  completedFields: number;
  connectionState: IntakeConnectionState;
  requiredFields: number;
  status: PatientStatus;
  transport: IntakeRealtimeTransport;
};

const statusLabels: Record<PatientStatus, string> = {
  inactive: "Inactive",
  active: "Actively filling",
  submitted: "Submitted",
};

export function FormProgress({
  completedFields,
  connectionState,
  requiredFields,
  status,
  transport,
}: FormProgressProps) {
  const progress =
    requiredFields === 0
      ? 0
      : Math.round((completedFields / requiredFields) * 100);
  const connectionLabel =
    connectionState === "connected"
      ? transport === "supabase"
        ? "Live sync connected"
        : "Local demo sync"
      : connectionState === "connecting"
        ? "Connecting sync"
        : "Sync unavailable";

  return (
    <div className="rounded-lg border border-agnos-border bg-agnos-surface p-5 shadow-sm shadow-blue-950/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-agnos-muted">
            Required completion
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
            {completedFields}
            <span className="text-base font-semibold text-agnos-muted">
              /{requiredFields}
            </span>
          </p>
        </div>
        <span className="rounded-full border border-agnos-cyan/30 bg-agnos-cyan-soft px-3 py-1.5 text-sm font-semibold text-agnos-blue-dark">
          {statusLabels[status]}
        </span>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-agnos-blue transition-[width] duration-200 ease-[var(--ease-out)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-agnos-muted">
        {progress}% complete. You can submit once every required field is filled.
      </p>
      <p
        className="mt-2 flex items-center gap-2 text-xs font-semibold text-agnos-muted"
        aria-live="polite"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            connectionState === "connected"
              ? "bg-emerald-500"
              : connectionState === "connecting"
                ? "bg-amber-500"
                : "bg-rose-500"
          }`}
          aria-hidden="true"
        />
        {connectionLabel}
      </p>
    </div>
  );
}
