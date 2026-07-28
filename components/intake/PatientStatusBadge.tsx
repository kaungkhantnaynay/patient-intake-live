import type { PatientStatus } from "@/lib/intake/types";

type PatientStatusBadgeProps = {
  status: PatientStatus;
};

const statusConfig: Record<
  PatientStatus,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  inactive: {
    label: "Inactive",
    description: "No recent patient activity",
    className: "border-slate-300 bg-slate-100 text-slate-700",
  },
  active: {
    label: "Actively filling",
    description: "Patient is currently editing the form",
    className:
      "border-agnos-cyan bg-agnos-cyan-soft text-agnos-blue-dark",
  },
  submitted: {
    label: "Submitted",
    description: "Patient has submitted the intake form",
    className: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
};

export function PatientStatusBadge({ status }: PatientStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${config.className}`}
      title={config.description}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}
