import Link from "next/link";
import { PatientForm } from "@/components/intake/PatientForm";

export default function PatientPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="text-sm font-semibold text-agnos-blue hover:text-agnos-blue-dark"
        >
          Back to overview
        </Link>

        <header className="mt-8 border-b border-agnos-border pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
            Patient Form
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            Patient intake form
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-agnos-muted">
            Enter patient details below. Required fields are validated before
            submission, and status tracking is ready for the live staff view in
            the next phases.
          </p>
        </header>

        <PatientForm />
      </div>
    </main>
  );
}
