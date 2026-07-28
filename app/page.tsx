import Image from "next/image";
import Link from "next/link";
import homepageBackground from "@/public/homepage-background.jpg";

const routes = [
  {
    href: "/patient",
    title: "Patient Form",
    eyebrow: "For patients",
    description:
      "Complete demographics, visit details, and emergency contact information.",
    action: "Start intake",
  },
  {
    href: "/staff",
    title: "Staff View",
    eyebrow: "For care teams",
    description: "Monitor status, connection health, and intake field readiness.",
    action: "Open dashboard",
  },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-5 py-6 text-[#102033] sm:px-6">
      <Image
        src={homepageBackground}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[72%_center] md:object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-white/80 sm:bg-white/70 md:bg-white/55 lg:bg-white/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background via-background/75 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
            Agnos Health
          </p>
        </header>

        <section className="flex flex-1 flex-col justify-center pb-12 pt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-agnos-blue">
              Real-time patient intake
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
              Move patients from arrival to review with less friction.
            </h1>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="pressable group rounded-lg border border-white/80 bg-white/90 p-5 shadow-lg shadow-blue-950/10 backdrop-blur hover:-translate-y-0.5 hover:border-agnos-cyan hover:bg-white focus:outline-none focus:ring-2 focus:ring-agnos-blue focus:ring-offset-2"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-agnos-blue">
                  {route.eyebrow}
                </span>
                <span className="mt-2 block text-xl font-semibold text-[#102033]">
                  {route.title}
                </span>
                <span className="mt-3 block leading-7 text-[#58708c]">
                  {route.description}
                </span>
                <span className="mt-5 inline-flex text-sm font-semibold text-agnos-blue group-hover:text-agnos-blue-dark">
                  {route.action}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
