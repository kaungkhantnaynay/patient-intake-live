import Link from "next/link";
import { PatientForm } from "@/components/intake/PatientForm";

export default function PatientPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="pressable inline-flex rounded-md text-sm font-semibold text-agnos-blue hover:text-agnos-blue-dark focus:outline-none focus:ring-2 focus:ring-agnos-blue focus:ring-offset-2"
        >
          Back
        </Link>

        <header className="mt-7 border-b border-agnos-border pb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
            Patient Form
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            Patient intake
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-agnos-muted">
            Enter the details the care team needs before the visit. Required
            fields validate as you move through the form.
          </p>
        </header>

        <PatientForm />
      </div>
    </main>
  );
}
