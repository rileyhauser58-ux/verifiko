import Link from "next/link";
import { type ReactNode } from "react";
import { Logo } from "@/components/nav/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        {children}
      </div>
    </div>
  );
}
