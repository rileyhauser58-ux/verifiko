import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/dal";
import { getProviderCertificationsDTO } from "@/lib/dto";
import { CertificationUpload } from "@/components/providers/certification-upload";
import { CertificationManageList } from "@/components/providers/certification-manage-list";

export const metadata = { title: "Certificaciones" };

export default async function CertificacionesPage() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "provider") {
    redirect("/panel");
  }

  const certifications = await getProviderCertificationsDTO(profile.id);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Certificaciones</h1>
      <p className="mt-1 text-muted">
        Sube certificados de instituciones (SEC, gremios, cursos, etc.) para
        que los clientes los vean en tu perfil público.
      </p>

      <div className="mt-6">
        <CertificationUpload userId={profile.id} />
      </div>

      <div className="mt-6">
        <CertificationManageList certifications={certifications} />
      </div>
    </div>
  );
}
