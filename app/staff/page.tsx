import Link from "next/link";
import { StaffDashboard } from "@/components/intake/StaffDashboard";

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-agnos-blue-dark px-6 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="text-sm font-semibold text-agnos-cyan hover:text-agnos-cyan-soft"
        >
          Back to overview
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-cyan">
            Staff View
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            Staff monitoring dashboard
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Review patient intake fields, status, and connection state from a
            responsive dashboard. Supabase Realtime will feed this view in Phase
            4.
          </p>
        </header>

        <StaffDashboard />
      </div>
    </main>
  );
}
