import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import { Logo } from "@/components/nav/logo";
import { UserMenu } from "@/components/nav/user-menu";

export async function Navbar() {
  const profile = await getCurrentUserProfile();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {profile?.role === "provider" ? (
            <Link
              href="/panel/perfil"
              className="font-medium text-foreground/80 hover:text-primary"
            >
              Consigue clientes
            </Link>
          ) : (
            <Link
              href="/buscar"
              className="font-medium text-foreground/80 hover:text-primary"
            >
              Buscar prestadores
            </Link>
          )}
        </nav>
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
