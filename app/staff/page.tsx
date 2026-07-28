import Link from "next/link";
import { intakeFields, intakeSections } from "@/lib/intake/schema";

const statuses = ["Inactive", "Active", "Submitted"];

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
            Live monitoring shell
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Phase 1 prepares the route and read-only structure. Live updates,
            field values, timestamps, and connection states arrive in later
            phases.
          </p>
        </header>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.06] p-5">
          <h2 className="text-lg font-semibold">Patient status states</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {statuses.map((status) => (
              <span
                key={status}
                className="rounded-full border border-agnos-cyan/30 bg-agnos-cyan/10 px-3 py-1.5 text-sm font-semibold text-blue-50"
              >
                {status}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {Object.entries(intakeSections).map(([section, title]) => {
            const fields = intakeFields.filter(
              (field) => field.section === section,
            );

            return (
              <div
                key={section}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <h2 className="text-lg font-semibold">{title}</h2>
                <dl className="mt-4 space-y-3">
                  {fields.map((field) => (
                    <div
                      key={field.name}
                      className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-sm font-medium text-blue-100">
                        {field.label}
                      </dt>
                      <dd className="text-sm font-semibold text-blue-200/60">
                        Awaiting input
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
