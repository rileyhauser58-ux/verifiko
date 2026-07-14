"use client";

import { useActionState } from "react";
import { updateProviderProfile } from "@/app/actions/provider-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Comuna, ProviderPublicProfile } from "@/types/domain";

export function ProviderProfileForm({
  categories,
  comunas,
  initial,
}: {
  categories: Category[];
  comunas: Comuna[];
  initial: ProviderPublicProfile | null;
}) {
  const [state, action, pending] = useActionState(
    updateProviderProfile,
    undefined
  );

  const selectedCategoryIds = new Set(
    initial?.categories.map((c) => c.id) ?? []
  );
  const selectedComunaIds = new Set(initial?.comunas.map((c) => c.id) ?? []);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="business_name" className="text-sm font-medium">
          Nombre de tu negocio (opcional)
        </label>
        <Input
          id="business_name"
          name="business_name"
          defaultValue={initial?.business_name ?? ""}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="years_experience" className="text-sm font-medium">
          Años de experiencia
        </label>
        <Input
          id="years_experience"
          name="years_experience"
          type="number"
          min={0}
          max={80}
          defaultValue={initial?.years_experience ?? undefined}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="bio" className="text-sm font-medium">
          Cuéntale a los usuarios sobre tu trabajo
        </label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={initial?.bio ?? ""}
          required
          minLength={20}
        />
        {state?.errors?.bio && (
          <p className="text-xs text-red-600">{state.errors.bio[0]}</p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Rubros que ofreces</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                name="category_ids"
                value={category.id}
                defaultChecked={selectedCategoryIds.has(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
        {state?.errors?.category_ids && (
          <p className="text-xs text-red-600">
            {state.errors.category_ids[0]}
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Comunas donde atiendes</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {comunas.map((comuna) => (
            <label key={comuna.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="comuna_ids"
                value={comuna.id}
                defaultChecked={selectedComunaIds.has(comuna.id)}
              />
              {comuna.name}
            </label>
          ))}
        </div>
        {state?.errors?.comuna_ids && (
          <p className="text-xs text-red-600">{state.errors.comuna_ids[0]}</p>
        )}
      </fieldset>

      {state?.message && <p className="text-sm text-trust">{state.message}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  );
}
