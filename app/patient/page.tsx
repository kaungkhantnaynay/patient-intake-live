import Link from "next/link";
import { intakeFields, intakeSections } from "@/lib/intake/schema";

export default function PatientPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="text-sm font-semibold text-teal-700 hover:text-teal-800"
        >
          Back to overview
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
            Patient Form
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            Intake form shell
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-700">
            Phase 1 defines the route and shared field schema. The interactive
            form controls, validation UI, and status tracking arrive in Phase 2.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {Object.entries(intakeSections).map(([section, title]) => {
            const fields = intakeFields.filter(
              (field) => field.section === section,
            );

            return (
              <div
                key={section}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <h2 className="text-lg font-semibold">{title}</h2>
                <ul className="mt-4 space-y-3">
                  {fields.map((field) => (
                    <li
                      key={field.name}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <span className="font-medium text-slate-800">
                        {field.label}
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {field.required ? "Required" : "Optional"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
