import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/dal";
import { getVerificationDocumentsDTO } from "@/lib/dto";
import { VerificationUpload } from "@/components/providers/verification-upload";
import type { DocumentType } from "@/types/domain";

export const metadata = { title: "Verificación de identidad" };

const DOCUMENT_TYPES: DocumentType[] = ["id_card", "selfie", "background_check"];

export default async function VerificacionPage() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "provider") {
    redirect("/panel");
  }

  const documents = await getVerificationDocumentsDTO(profile.id);
  const statusByType = new Map(documents.map((d) => [d.document_type, d.status]));

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Verificación de identidad</h1>
      <p className="mt-1 text-muted">
        Sube tus documentos para que revisemos tu identidad a mano y activemos
        la insignia de &ldquo;Verificado&rdquo; en tu perfil. Solo tú puedes
        ver estos archivos.
      </p>

      <div className="mt-6 space-y-3">
        {DOCUMENT_TYPES.map((type) => (
          <VerificationUpload
            key={type}
            userId={profile.id}
            documentType={type}
            currentStatus={statusByType.get(type) ?? null}
          />
        ))}
      </div>
    </div>
  );
}
