import Link from "next/link";
import { StaffDashboard } from "@/components/intake/StaffDashboard";

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="pressable inline-flex rounded-md text-sm font-semibold text-agnos-blue hover:text-agnos-blue-dark focus:outline-none focus:ring-2 focus:ring-agnos-blue focus:ring-offset-2"
        >
          Back
        </Link>

        <header className="mt-7 border-b border-agnos-border pb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
            Staff View
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            Intake monitor
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-agnos-muted">
            Track completion, patient activity, and field readiness from a calm
            dashboard built for repeated review.
          </p>
        </header>

        <StaffDashboard />
      </div>
    </main>
  );
}
