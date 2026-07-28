import Link from "next/link";

const routes = [
  {
    href: "/patient",
    title: "Patient Form",
    description: "Open the responsive intake form for patient information.",
  },
  {
    href: "/staff",
    title: "Staff View",
    description: "Open the live monitoring view for staff review.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
          Agnos Assessment
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            Real-time patient intake
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Choose an interface to review the Phase 1 application skeleton. The
            shared intake schema is ready for the patient form and staff
            dashboard work in the next phase.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              <span className="text-xl font-semibold text-slate-950">
                {route.title}
              </span>
              <span className="mt-3 block leading-7 text-slate-600">
                {route.description}
              </span>
              <span className="mt-5 inline-flex text-sm font-semibold text-teal-700 group-hover:text-teal-800">
                Open {route.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
