import { RequestResetForm } from "@/components/auth/request-reset-form";

export const metadata = {
  title: "Recuperar contraseña | Verifiko",
};

export default function OlvidePasswordPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-semibold">
        Recupera tu contraseña
      </h1>
      <RequestResetForm />
    </div>
  );
}
