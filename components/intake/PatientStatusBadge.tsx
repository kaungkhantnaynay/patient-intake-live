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
    className: "border-slate-300/40 bg-slate-200/10 text-blue-50",
  },
  active: {
    label: "Actively filling",
    description: "Patient is currently editing the form",
    className: "border-agnos-cyan/40 bg-agnos-cyan/15 text-white",
  },
  submitted: {
    label: "Submitted",
    description: "Patient has submitted the intake form",
    className: "border-emerald-300/40 bg-emerald-300/15 text-white",
  },
};

export function PatientStatusBadge({ status }: PatientStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${config.className}`}
      title={config.description}
    >
      {config.label}
    </span>
  );
}
