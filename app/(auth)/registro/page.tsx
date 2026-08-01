import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Crear cuenta | Verifiko",
};

export default function RegistroPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-semibold">
        Crea tu cuenta
      </h1>
      <SignupForm />
    </div>
  );
}
