import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getAllCategories,
  getAllComunas,
  getProviderPublicProfileDTO,
} from "@/lib/dto";
import { AvatarUpload } from "@/components/providers/avatar-upload";
import { Card } from "@/components/ui/card";
import { ProviderProfileForm } from "@/components/providers/provider-profile-form";

export const metadata = { title: "Mi perfil de prestador" };

export default async function PerfilPage() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "provider") {
    redirect("/panel");
  }

  const [categories, comunas, existing] = await Promise.all([
    getAllCategories(),
    getAllComunas(),
    getProviderPublicProfileDTO(profile.id),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Tu perfil de prestador</h1>
      <p className="mt-1 text-muted">
        Esta información es la que ven los usuarios cuando te buscan.
      </p>

      <div className="mt-6">
        <AvatarUpload
          userId={profile.id}
          fullName={profile.full_name}
          currentAvatarUrl={profile.avatar_url}
        />
        <p className="mt-2 text-xs text-muted">
          Un perfil con foto se ve más confiable y recibe más solicitudes.
        </p>
      </div>

      <Card className="mt-6 border-trust/30 bg-trust-tint">
        <p className="text-sm text-foreground">
          <strong>Tu información importa:</strong> mientras más completa y
          verídica sea tu descripción, y una vez que verifiques tu identidad
          con tu carnet (RUT), más confianza vas a generar en los clientes
          que te contraten.
        </p>
        <Link
          href="/panel/verificacion"
          className="mt-2 inline-block text-sm font-medium text-trust hover:underline"
        >
          Verifica tu identidad →
        </Link>
      </Card>

      <div className="mt-6">
        <ProviderProfileForm
          categories={categories}
          comunas={comunas}
          initial={existing}
        />
      </div>
    </div>
  );
}
