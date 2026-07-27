import { getLocationShareDTO } from "@/lib/dto";
import { LocationShareViewer } from "@/components/requests/location-share-viewer";

export const metadata = { title: "Ubicación compartida" };

type CompartirPageProps = {
  params: Promise<{ token: string }>;
};

export default async function CompartirPage({ params }: CompartirPageProps) {
  const { token } = await params;
  const share = await getLocationShareDTO(token);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">Ubicación en vivo</h1>

      {!share || !share.active ? (
        <p className="mt-4 text-sm text-muted">
          Este enlace ya no está disponible.
        </p>
      ) : (
        <div className="mt-4">
          <LocationShareViewer shareToken={token} />
        </div>
      )}
    </div>
  );
}
