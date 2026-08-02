import { getAllCategories, getAllComunas, searchProvidersDTO } from "@/lib/dto";
import { verifySession } from "@/lib/dal";
import { ProviderCard } from "@/components/providers/provider-card";
import { ProviderFilters } from "@/components/providers/provider-filters";

export const metadata = {
  title: "Buscar prestadores",
  description:
    "Filtra por rubro y comuna para encontrar gasfiters, electricistas, maestros y más, con calificaciones reales de otros usuarios.",
};

type BuscarPageProps = {
  searchParams: Promise<{ categoria?: string; comuna?: string; q?: string }>;
};

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  await verifySession();
  const filters = await searchParams;

  const [providers, categories, comunas] = await Promise.all([
    searchProvidersDTO(filters),
    getAllCategories(),
    getAllComunas(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-2xl font-semibold">Encuentra un prestador</h1>
      <p className="mt-1 text-muted">
        Filtra por rubro y comuna para encontrar a la persona indicada.
      </p>

      <div className="mt-6">
        <ProviderFilters categories={categories} comunas={comunas} />
      </div>

      {providers.length === 0 ? (
        <div className="mt-16 text-center text-muted">
          No encontramos prestadores con esos filtros. Prueba ajustando la
          búsqueda.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}
