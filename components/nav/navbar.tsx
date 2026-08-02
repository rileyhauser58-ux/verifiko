import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import { Logo } from "@/components/nav/logo";
import { UserMenu } from "@/components/nav/user-menu";

export async function Navbar() {
  const profile = await getCurrentUserProfile();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        {profile?.role !== "provider" && (
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <Link
              href="/buscar"
              className="font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Buscar prestadores
            </Link>
          </nav>
        )}
        <div className="ml-auto">
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
