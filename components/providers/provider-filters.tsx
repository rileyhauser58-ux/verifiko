"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Category, Comuna } from "@/types/domain";

export function ProviderFilters({
  categories,
  comunas,
}: {
  categories: Category[];
  comunas: Comuna[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input
        placeholder="Buscar por nombre o palabra clave"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateParam("q", e.target.value)}
        className="sm:col-span-1"
      />

      <Select
        defaultValue={searchParams.get("categoria") ?? ""}
        onChange={(e) => updateParam("categoria", e.target.value)}
      >
        <option value="">Todos los rubros</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        defaultValue={searchParams.get("comuna") ?? ""}
        onChange={(e) => updateParam("comuna", e.target.value)}
      >
        <option value="">Todas las comunas</option>
        {comunas.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
