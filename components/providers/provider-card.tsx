import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import type { ProviderCardData } from "@/types/domain";

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  const displayName = provider.business_name || provider.full_name;

  return (
    <Link href={`/prestadores/${provider.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar src={provider.avatar_url} name={displayName} size={40} />
            <h3 className="font-semibold">{displayName}</h3>
          </div>
          {provider.verified && <Badge variant="verified">Verificado</Badge>}
        </div>

        <div className="mt-2">
          <StarRating rating={provider.avg_rating} reviewCount={provider.review_count} size="sm" />
        </div>

        {provider.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-muted">{provider.bio}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {provider.categories.map((c) => (
            <Badge key={c.id}>{c.name}</Badge>
          ))}
        </div>

        {provider.comunas.length > 0 && (
          <p className="mt-3 text-xs text-muted">
            Atiende en {provider.comunas.map((c) => c.name).join(", ")}
          </p>
        )}
      </Card>
    </Link>
  );
}
