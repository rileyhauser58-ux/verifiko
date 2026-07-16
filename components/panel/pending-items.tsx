import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { PendingItem } from "@/types/domain";

export function PendingItems({ items }: { items: PendingItem[] }) {
  if (items.length === 0) return null;

  return (
    <Card>
      <h2 className="font-semibold">Pendientes</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <Link
              href={item.href}
              className="text-sm text-primary hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
