import Link from "next/link";
import { getAllCategories } from "@/lib/dto";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const categories = await getAllCategories();

  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Encuentra a la persona indicada para tu hogar, con confianza
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Gasfiters, electricistas, maestros y más — con calificaciones
          reales de otros usuarios para que contrates con seguridad.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/buscar">
            <Button className="w-full sm:w-auto">Buscar prestadores</Button>
          </Link>
          <Link href="/registro">
            <Button variant="secondary" className="w-full sm:w-auto">
              Ofrece tus servicios
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Perfiles verificados</h3>
            <p className="mt-1 text-sm text-muted">
              Identifica de un vistazo a los prestadores que hemos verificado.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Calificaciones reales</h3>
            <p className="mt-1 text-sm text-muted">
              Reseñas de usuarios que ya contrataron el servicio, sin filtros.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Búsqueda por comuna</h3>
            <p className="mt-1 text-sm text-muted">
              Filtra por rubro y zona para encontrar a alguien cerca de ti.
            </p>
          </Card>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-20">
          <h2 className="mb-4 text-lg font-semibold">Rubros disponibles</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/buscar?categoria=${category.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
