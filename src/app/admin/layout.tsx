"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import AdminV2Layout from "./v2-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const is2FaRoute = pathname === "/admin/setup-2fa" || pathname === "/admin/verify-2fa";

  if (pathname.startsWith("/admin") && !is2FaRoute) {
    return (
      <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading admin dashboard...</div>}>
        <AdminV2Layout>{children}</AdminV2Layout>
      </Suspense>
    );
  }
  return <>{children}</>;
}

