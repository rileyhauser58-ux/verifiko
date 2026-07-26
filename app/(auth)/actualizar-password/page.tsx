import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata = {
  title: "Actualizar contraseña | TodoServicios",
};

export default function ActualizarPasswordPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-semibold">
        Elige tu nueva contraseña
      </h1>
      <UpdatePasswordForm />
    </div>
  );
}
