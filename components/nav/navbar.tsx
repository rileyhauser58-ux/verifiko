import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import { UserMenu } from "@/components/nav/user-menu";

export async function Navbar() {
  const profile = await getCurrentUserProfile();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          ServiHogar
        </Link>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/buscar" className="hover:underline">
            Buscar prestadores
          </Link>
        </nav>
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
