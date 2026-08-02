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
        <div className="ml-auto">
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
