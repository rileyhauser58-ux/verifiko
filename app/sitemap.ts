import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://verifiko.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/terminos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
