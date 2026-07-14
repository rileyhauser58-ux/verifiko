import { StarRating } from "@/components/ui/star-rating";
import type { Review } from "@/types/domain";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted">
        Todavía no hay reseñas para este prestador.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-border pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{review.reviewer_name}</span>
            <span className="text-xs text-muted">{formatDate(review.created_at)}</span>
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.comment && (
            <p className="mt-2 text-sm text-muted">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
