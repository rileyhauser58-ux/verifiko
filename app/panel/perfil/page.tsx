import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getAllCategories,
  getAllComunas,
  getProviderPublicProfileDTO,
} from "@/lib/dto";
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
      <h1 className="text-2xl font-semibold">Tu perfil de prestador</h1>
      <p className="mt-1 text-muted">
        Esta información es la que ven los usuarios cuando te buscan.
      </p>

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
