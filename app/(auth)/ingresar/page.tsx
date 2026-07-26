import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Ingresar | TodoServicios",
};

export default function IngresarPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-semibold">
        Ingresa a tu cuenta
      </h1>
      <LoginForm />
    </div>
  );
}
