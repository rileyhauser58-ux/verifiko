"use client";

import { useActionState, useState } from "react";
import { submitReview } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ providerId }: { providerId: string }) {
  const action = submitReview.bind(null, providerId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [rating, setRating] = useState(0);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-medium">Deja tu calificación</p>

      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1 text-2xl text-primary">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`${value} estrellas`}
            className={value <= rating ? "opacity-100" : "opacity-30"}
          >
            ★
          </button>
        ))}
      </div>
      {state?.errors?.rating && (
        <p className="text-xs text-red-600">{state.errors.rating[0]}</p>
      )}

      <Textarea
        name="comment"
        placeholder="Cuenta cómo fue tu experiencia (opcional)"
        rows={3}
      />

      {state?.message && (
        <p className="text-sm text-trust">{state.message}</p>
      )}

      <Button type="submit" disabled={pending || rating === 0}>
        {pending ? "Enviando…" : "Enviar reseña"}
      </Button>
    </form>
  );
}
