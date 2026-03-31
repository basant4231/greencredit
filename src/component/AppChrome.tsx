"use client";

import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import { usePathname } from "next/navigation";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">{children}</main>
      <Footer />
    </>
  );
}
