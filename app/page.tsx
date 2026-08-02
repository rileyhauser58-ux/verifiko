import Link from "next/link";
import { getAllCategories } from "@/lib/dto";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";

const FEATURES = [
  {
    tone: "primary" as const,
    title: "Perfiles verificados",
    description:
      "Identifica de un vistazo a los prestadores que hemos verificado.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4"
      />
    ),
  },
  {
    tone: "trust" as const,
    title: "Calificaciones reales",
    description:
      "Reseñas de usuarios que ya contrataron el servicio, sin filtros.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5l2.47 5.01 5.53.8-4 3.9.94 5.5L12 16.4l-4.94 2.31.94-5.5-4-3.9 5.53-.8L12 3.5z"
      />
    ),
  },
  {
    tone: "primary" as const,
    title: "Búsqueda por comuna",
    description:
      "Filtra por rubro y zona para encontrar a alguien cerca de ti.",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
        />
        <circle cx="12" cy="9" r="2.5" strokeLinecap="round" />
      </>
    ),
  },
];

export default async function Home() {
  const categories = await getAllCategories();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-[65%] rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/2 h-[26rem] w-[26rem] translate-x-[10%] rounded-full bg-trust/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <span className="animate-fade-up inline-flex items-center rounded-full bg-primary-tint px-4 py-1.5 text-xs font-medium text-primary-hover">
            Servicios para el hogar, con confianza
          </span>

          <h1
            className="animate-fade-up mx-auto mt-5 max-w-2xl font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
            style={{ animationDelay: "90ms" }}
          >
            Encuentra a la persona indicada para tu hogar
          </h1>
          <p
            className="animate-fade-up mx-auto mt-4 max-w-xl text-lg text-muted"
            style={{ animationDelay: "180ms" }}
          >
            Gasfiters, electricistas, maestros y más — con calificaciones
            reales de otros usuarios para que contrates con seguridad.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-col justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "270ms" }}
          >
            <Link href="/registro">
              <Button className="w-full sm:w-auto">
                Ofrece tus servicios
                <span aria-hidden="true">→</span>
              </Button>
            </Link>
            <Link href="/buscar">
              <Button variant="secondary" className="w-full sm:w-auto">
                Buscar prestadores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <Reveal>
            <h2 className="mb-5 text-lg font-semibold">Rubros disponibles</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, i) => (
              <Reveal key={category.id} delay={i * 50}>
                <Link
                  href={`/buscar?categoria=${category.slug}`}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-hover"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <CategoryIcon slug={category.slug} className="h-7 w-7" />
                  </span>
                  <span className="font-medium">{category.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <Card className="h-full">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    feature.tone === "trust"
                      ? "bg-trust-tint text-trust"
                      : "bg-primary-tint text-primary-hover"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="h-5 w-5"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mt-3 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted">{feature.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
