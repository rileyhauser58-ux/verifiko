import type { MetadataRoute } from "next";
import { getAllPublicProviderIdsDTO } from "@/lib/dto";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://verifiko.cl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const providerIds = await getAllPublicProviderIdsDTO();

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/buscar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/terminos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    ...providerIds.map((id) => ({
      url: `${BASE_URL}/prestadores/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
